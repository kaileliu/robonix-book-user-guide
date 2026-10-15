---
last_update:
  date: 2026-10-14
---

# Python 接口参考

本页供软件包开发者查询构造提供方、发现和连接能力、ROS 2、MCP 与 gRPC 的用法。先完成一个[软件包示例](../developer-guide.md)再按需查阅；完整签名由源码生成的公共 API 提供。

本节解释软件包开发最常用的入口和参数。完整签名、默认值、返回类型与源码链接由 <a href="/api/python/public-api.html">Python 公共 API</a> 从当前源码生成；这里不重复内部方法。

## 构造能力提供方

```text
Primitive(id, namespace, *, pkg_root=None, md_path=None)
Service(id, namespace, *, pkg_root=None, md_path=None)
Skill(id, namespace, *, pkg_root=None, md_path=None)
```

| 参数 | 含义 |
|---|---|
| `id` | Atlas 中的提供方 ID。整机启动时必须等于部署实例的 `name`。构造函数会自动读取 `RBNX_INSTANCE_NAME`，其值覆盖这里写的 `id`，因此无需显式传入。代码里的 `id` 只是 `rbnx start` 裸跑时的默认值。 |
| `namespace` | 提供方的主要能力命名空间。运行时会去掉首尾 `/`，空值直接报错；普通能力约定落在该命名空间之外时只记录警告。 |
| `pkg_root` | 软件包根目录。省略时先从调用文件向上寻找 `package_manifest.yaml`，找不到再使用当前工作目录；代码生成产物和默认 `CAPABILITY.md` 都从这里解析。 |
| `md_path` | 显式指定 `CAPABILITY.md`。省略时使用软件包根目录中实际存在的同名文件；传空字符串表示不注册能力说明。 |

`Primitive`、`Service` 和 `Skill` 共享同一组开发接口；选择哪一个只决定向 Atlas 注册的提供方类型和技能的延迟激活行为。

## 查询能力目录

```python
ATLAS.find_capability(
    contract_id="robonix/primitive/camera/rgb",
    transport=Transport.ROS2,
    provider_kind="primitive",
    provider_id="front_camera",
    namespace_prefix="robonix/primitive/camera",
)
```

这些参数均为仅限关键字参数：

| 参数 | 默认值 | 过滤对象 |
|---|---|---|
| `contract_id` | `""` | 能力约定 ID；空字符串表示不限 |
| `transport` | `Transport.UNSPECIFIED` | `GRPC`、`ROS2` 或 `MCP`；未指定表示不限 |
| `provider_kind` | `Kind.UNSPECIFIED` | 原语、服务或技能；未指定表示不限 |
| `provider_id` | `""` | 指定运行实例 ID；空字符串表示不限 |
| `namespace_prefix` | `""` | 提供方主要命名空间前缀；空字符串表示不限 |

`find_capability(...)` 返回 `list[Capability]`。需要恰好一个结果时使用 `find_unique_capability(...)`；其签名要求显式传入 `contract_id`，零个或多个结果都会抛出 `ValueError`。通常应传非空 ID，把唯一性限定在一条能力约定内；多实例实现同一约定时再用 `provider_id` 消除歧义。

## 连接能力

```python
channel = service.connect_capability(
    provider,
    contract_id,
    transport,
)
```

| 参数 | 含义 |
|---|---|
| `provider` | `ATLAS.find_capability(...)` 返回的 `Capability`，或 `ATLAS.query_*` 返回的 `CapabilityProvider` |
| `contract_id` | 要连接的能力约定 ID |
| `transport` | 本次连接使用的 `Transport` 枚举、字符串或整数值 |

返回的 `Channel` 包含 `endpoint`、`channel_id` 和传输参数，并在 Atlas 中记录消费者到提供方的连接。用 `with channel:` 或显式调用 `channel.close()` 可以断开连接；提供方退出时也会关闭自己建立的全部通道。`Capability.description` 保存这项运行时实现的实例说明，能力约定的通用说明则位于 `ContractDescriptor.description`；消费者可合并两者。`McpParams` 当前只包含输入结构 JSON。

## ROS 2 便捷接口

完整签名如下；`contract_id` 之后的参数只能按名称传入：

```text
create_publisher(contract_id, *, topic, msg_type,
                 qos="best_effort", declare=True, description="")
create_subscription(contract_id, *, topic, msg_type, callback,
                    qos="best_effort", declare=True)
emit(contract_id, msg)
```

典型用法：

```python
provider.create_publisher(
    contract_id=...,
    topic=...,
    msg_type=...,
    qos="best_effort",
)
provider.create_subscription(
    contract_id=...,
    topic=...,
    msg_type=...,
    callback=...,
    qos="best_effort",
)
provider.emit(contract_id, message)
```

`topic` 是实际 ROS 2 名称；`msg_type` 接受消息类或运行时可解析的类型字符串；`qos` 接受预设字符串或整数深度。`declare=True` 时，方法还会向 Atlas 声明能力。发布者的 `description` 是给调用方和模型看的实例说明。`emit` 按 `contract_id` 查找此前创建的发布者，未创建时抛出 `RuntimeError`。

消费另一提供方发布的话题时，常规路径不是手写话题名，而是让 Atlas 返回实际端点和 QoS，再从 `Channel` 创建订阅。下面的代码放在已经创建的 `service` 实例中；`on_image` 是接收 `sensor_msgs/msg/Image` 的业务回调：

```python
from robonix_api import ATLAS, Ok
from robonix_api.atlas_types import Transport

@service.on_init
def connect_camera(_config):
    camera_rgb = ATLAS.find_unique_capability(
        contract_id="robonix/primitive/camera/rgb",
        provider_id="front_camera",
        transport=Transport.ROS2,
    )
    channel = service.connect_capability(
        camera_rgb,
        camera_rgb.contract_id,
        Transport.ROS2,
    )
    service.create_subscription_from_channel(
        channel,
        msg_type="sensor_msgs/msg/Image",
        callback=on_image,
    )
    return Ok()

service.run()
```

`find_unique_capability` 负责发现并消除多实例歧义，`connect_capability` 在 Atlas 中建立消费者到提供方的连接，`create_subscription_from_channel` 使用返回的真实端点。当前实现尚未把 Atlas 返回的字符串 QoS 名称转换为 ROS 2 QoS 配置，而是使用后端默认值；需要精确 QoS 时，先完成能力发现，再用 `channel.endpoint` 和显式 `qos` 调用 `create_subscription(..., declare=False)`。只有在话题名由 Robonix 之外的系统固定、且调用方有意绕过 Atlas 发现时，才完全跳过能力发现；这种写法不会为消费端声明新能力。

`create_publisher` 和 `create_subscription` 会立即创建 ROS 对象，应在 provider 注册后调用，通常放在 `on_init`。`declare_ros2_topic` 和 `declare_ros2_service` 只向 Atlas 声明端点；它们不会替开发者创建 `rclpy` 发布者、订阅者或服务。

## MCP 与 gRPC

### MCP 调用

MCP 处理函数接收代码生成的数据类，并返回对应的响应数据类：

```python
@provider.mcp(contract_id, description="...")
def tool(req: RequestType) -> ResponseType:
    ...
```

`contract_id` 是能力约定 ID。装饰器在模块导入时记录处理函数；`provider.bootstrap()` 或 `provider.run()` 才会创建服务端点、向 Atlas 声明能力并开始接收请求。`description` 可省略；显式值优先，否则读取处理函数的 docstring。装饰器会返回原函数，因此业务逻辑仍可直接单元测试。

#### MCP 长时间任务

一次调用内即可返回最终结果的能力是同步能力。导航、抓取等动作在启动后仍需持续运行时，同一个提供方应注册三条 MCP 能力约定：

| 能力约定 ID | 职责 | 最低响应要求 |
|---|---|---|
| `<id>` | 启动任务 | 返回启动结果；建议包含稳定、非空的 `run_id` |
| `<id>/status` | 查询任务状态 | 返回字符串字段 `state`，可附带字符串字段 `detail` |
| `<id>/cancel` | 请求取消任务 | 返回该能力约定定义的取消响应 |

Executor 在分发 `<id>` 前查询同一提供方的 MCP 能力目录：

- 两条子能力都不存在时，`<id>` 按同步能力执行，首次调用返回后节点结束；
- `/status` 与 `/cancel` 同时存在时，`<id>` 按异步能力执行；
- 只存在其中一条时，配置不完整，Executor 不会启动主任务，而是直接让该节点失败。

异步能力的执行顺序如下：

1. Executor 调用 `<id>` 启动任务，并从响应 JSON 中读取 `run_id`。
2. Executor 每 2 秒调用一次 `<id>/status`，直到收到终态。
3. 方案被取消且任务仍在运行时，Executor 调用 `<id>/cancel`。
4. 普通 RTDL 方案只调用 `<id>`；状态查询和取消由 Executor 管理，不应作为普通业务步骤重复编排。

`/status` 返回的 `state` 不区分大小写，可使用下列值：

| 状态 | 是否终态 | 含义 |
|---|:---:|---|
| `PENDING` | 否 | 已接受，尚未开始运行 |
| `RUNNING` | 否 | 正在运行 |
| `PAUSED` | 否 | 已暂停，尚未结束 |
| `SUCCEEDED` | 是 | 成功完成 |
| `FAILED` | 是 | 执行失败 |
| `CANCELED` / `CANCELLED` | 是 | 已取消 |
| `TIMEOUT` | 是 | 执行超时 |

缺少 `state` 或返回未知状态会使节点失败。`detail` 用于携带进度或终态说明。处理函数无法完成查询或取消时，应抛出 `RuntimeError`，不要把错误伪装成正常响应。

`run_id` 用于区分同一能力的多次运行，提供方支持并发任务时必须返回稳定、非空的 ID，并让 `/status` 与 `/cancel` 按该 ID 定位同一次运行。当前 Executor 兼容不返回 `run_id` 的旧接口：此时两条子能力收到空请求 `{}`，提供方必须明确将它解释为当前或最近一次运行；这种兼容方式不适合并发任务。

下面是接口形态的最小示例；请求和响应类型必须来自当前软件包的代码生成结果：

```python
@service.mcp("robonix/service/example/run")
def run(req: Run_Request) -> Run_Response:
    run_id = start_work(req)
    return Run_Response(accepted=True, run_id=run_id)

@service.mcp("robonix/service/example/run/status")
def run_status(req: RunStatus_Request) -> RunStatus_Response:
    state, detail = get_work_status(req.run_id)
    return RunStatus_Response(state=state, detail=detail)

@service.mcp("robonix/service/example/run/cancel")
def run_cancel(req: CancelRun_Request) -> CancelRun_Response:
    accepted = cancel_work(req.run_id)
    return CancelRun_Response(accepted=accepted)
```

三条能力分别需要与自身请求和响应匹配的 `.srv` 和能力约定 TOML。它们都使用 `mode = "rpc"` 和 MCP 传输；`/status`、`/cancel` 不是新的模式，也不是 Executor 的通用控制面接口。导航服务的完整骨架可参考[开发一个服务](implement-service.md)。

### gRPC 调用

#### gRPC 生成代码

`rbnx codegen` 根据能力约定 TOML 中的 `mode` 和 `idl` 生成：

- 业务消息模块 `<idl-package>_pb2.py`，例如 `map_pb2.py`、`audio_pb2.py`；
- 汇总服务模块 `robonix_contracts_pb2_grpc.py`，其中包含每条能力约定的 `Stub`、`Servicer` 和注册函数；
- `robonix_contracts.proto`，可直接检查最终生成的一元或流式 RPC 形态。

业务消息模块只保存消息类。`Stub` 和 `Servicer` 必须从 `robonix_contracts_pb2_grpc.py` 导入，不能从 `<idl-package>_pb2_grpc.py` 猜测或导入。

| 输入定义 | Python 生成类型 |
|---|---|
| `capabilities/lib/<pkg>/msg/Foo.msg` | `<pkg>_pb2.Foo` |
| `capabilities/lib/<pkg>/srv/Hello.srv` | `<pkg>_pb2.Hello_Request` 与 `<pkg>_pb2.Hello_Response` |
| 能力约定 `robonix/service/example/hello` | `robonix_contracts_pb2_grpc.RobonixServiceExampleHelloStub` 与 `RobonixServiceExampleHelloServicer` |
| 上述约定引用 `Hello.srv` | Stub 和 Servicer 中的方法名为 `Hello` |

服务类名称由完整 `contract_id` 的每一段转为 PascalCase 后拼接；RPC 方法名来自 `.srv` 文件名。不要手写猜测复杂名称：构建后可在 `rbnx-build/codegen/proto_gen/robonix_contracts_pb2_grpc.py` 查到准确类名，在 `robonix_contracts.proto` 查到准确方法和 wire type。

`@provider.grpc(...)` 自动实现并注册该能力约定生成的单方法 `Servicer`，开发者只写处理函数：

```python
import grpc

@provider.grpc(contract_id, description="...")
def method(request: RequestType, context: grpc.ServicerContext) -> ResponseType:
    ...
```

处理函数的两个位置参数不是 Robonix 自定义对象：

| 参数 | 精确类型 | 用法 |
|---|---|---|
| `request` | 当前 RPC 生成的 protobuf 消息实例，继承 `google.protobuf.message.Message` | 一元请求和服务端流式响应模式中直接读取字段，例如 `request.text` |
| `request_iterator` | gRPC 提供的同步迭代器；每次迭代得到一个由 IDL 决定的 protobuf 流元素 | 客户端流式和双向流式模式中使用 `for item in request_iterator` 消费；调用方结束输入后循环自然结束 |
| `context` | gRPC 公共接口 [`grpc.ServicerContext`](https://grpc.github.io/grpc/python/grpc.html#grpc.ServicerContext) | `is_active()` 检查调用是否仍有效，`time_remaining()` 读取剩余期限，`peer()` 查看调用方，`set_code()` / `set_details()` 设置最终状态，`abort(code, details)` 立即以错误终止 RPC |

处理函数也可以只写第一个参数；框架会根据函数签名决定是否传入 `context`。需要取消检测、超时、元数据或明确错误状态时，应保留第二个参数并标注为 `grpc.ServicerContext`。不要把实际运行时的 gRPC 私有类名写进类型注解。

#### 流式模式与 IDL 约束

一元 RPC 和三种流式 RPC 都使用 `.srv`。`---` 上方是请求方向，下方是响应方向。流式方向必须恰好包含一个字段，而且该字段必须引用一个具名 ROS 消息类型；这个字段所引用的消息就是线上逐条传输的流元素。代码生成器会拒绝字段数不为 1 或以 primitive 作为流元素的定义。

| `mode` | 生成的 gRPC 形态 | `.srv` 约束 | 提供方处理函数 |
|---|---|---|---|
| `rpc` | `M(Request) returns (Response)` | 请求、响应字段数不限 | `(request, context) -> Response` |
| `rpc_server_stream` | `M(Request) returns (stream Item)` | 响应段恰好一个具名消息字段 | `(request, context) -> Iterator[Item]`，用 `yield` 发送 |
| `rpc_client_stream` | `M(stream Item) returns (Response)` | 请求段恰好一个具名消息字段 | `(request_iterator, context) -> Response` |
| `rpc_bidirectional_stream` | `M(stream In) returns (stream Out)` | 请求、响应段各恰好一个具名消息字段 | `(request_iterator, context) -> Iterator[Out]`，边读取边 `yield` |

`rpc_server_stream` 的非流式请求段如果为空或包含多个字段，参数类型是 `<SrvName>_Request`；如果请求段恰好只有一个具名消息字段，当前代码生成器会直接使用该字段的消息类型。`rpc_client_stream` 的非流式响应段有字段时返回 `<SrvName>_Response`，为空时返回 `google.protobuf.empty_pb2.Empty`。

`topic_out` 和 `topic_in` 使用 `.msg` 而不是 `.srv`。当选择 gRPC 传输时，代码生成器分别把它们映射成 `Empty -> stream Message` 和 `stream Message -> Empty`；选择 ROS 2 传输时，由提供方创建 publisher/subscription，再向 Atlas 声明端点。

下面四组示例使用主仓库中真实存在的能力约定。完整的 gRPC Python 调用语义也可参见 [gRPC Python 基础教程](https://grpc.io/docs/languages/python/basics/)。

#### 一元 RPC

`robonix/service/map/get_mode` 使用 `map/srv/GetMode.srv`，生成：

```proto
rpc GetMode(robonix.map.GetMode_Request)
    returns (robonix.map.GetMode_Response);
```

提供方实现：

```python
import grpc
import map_pb2

@provider.grpc("robonix/service/map/get_mode")
def get_mode(
    request: map_pb2.GetMode_Request,
    context: grpc.ServicerContext,
) -> map_pb2.GetMode_Response:
    del request, context
    return map_pb2.GetMode_Response(
        ok=True,
        mode="mapping",
        detail="",
    )
```

调用方先通过 Atlas 选择提供方并登记连接，再用生成的 `Stub` 调用：

```python
import grpc
import map_pb2
import robonix_contracts_pb2_grpc as contracts_grpc

from robonix_api import ATLAS
from robonix_api.atlas_types import Transport

target = ATLAS.find_unique_capability(
    contract_id="robonix/service/map/get_mode",
    transport=Transport.GRPC,
)
edge = consumer.connect_capability(
    target,
    "robonix/service/map/get_mode",
    Transport.GRPC,
)
try:
    with grpc.insecure_channel(edge.endpoint) as rpc_channel:
        stub = contracts_grpc.RobonixServiceMapGetModeStub(rpc_channel)
        response = stub.GetMode(map_pb2.GetMode_Request(), timeout=5.0)
        print(response.mode)
finally:
    edge.close()
```

`edge` 是 Atlas 中的逻辑连接，`rpc_channel` 是真正承载消息的 gRPC channel；两者都要关闭。

#### 服务端流式响应

`robonix/service/speech/tts_stream` 的请求段包含多个参数，响应段只有 `tts/SynthesizeAudioChunk chunk`。因此生成：

```proto
rpc SynthesizeStream(robonix.tts.SynthesizeStream_Request)
    returns (stream robonix.tts.SynthesizeAudioChunk);
```

提供方每次 `yield` 一个响应元素；函数结束即关闭响应流：

```python
from collections.abc import Iterator

import audio_pb2
import grpc
import tts_pb2

@provider.grpc("robonix/service/speech/tts_stream")
def synthesize_stream(
    request: tts_pb2.SynthesizeStream_Request,
    context: grpc.ServicerContext,
) -> Iterator[tts_pb2.SynthesizeAudioChunk]:
    for sequence, data in enumerate(
        synthesizer.generate(request.text, voice=request.voice)
    ):
        if not context.is_active():
            return
        yield tts_pb2.SynthesizeAudioChunk(
            chunk=audio_pb2.AudioChunk(data=data, sequence=sequence),
            encoding="pcm_s16le",
            sample_rate_hz=16000,
        )
```

调用方得到一个响应迭代器：

```python
import tts_pb2
import robonix_contracts_pb2_grpc as contracts_grpc

stub = contracts_grpc.RobonixServiceSpeechTtsStreamStub(rpc_channel)
request = tts_pb2.SynthesizeStream_Request(text="你好")
for chunk in stub.SynthesizeStream(request, timeout=30.0):
    speaker.write(chunk.chunk.data)
```

#### 客户端流式请求

`robonix/service/speech/wake_word` 的请求段只有 `audio/msg/AudioChunk chunk`，因此发送的是裸 `audio_pb2.AudioChunk`，不是 `DetectWakeWord_Request` 包装器：

```proto
rpc DetectWakeWord(stream robonix.audio.AudioChunk)
    returns (robonix.speech.DetectWakeWord_Response);
```

提供方消费请求迭代器，输入关闭后返回一个响应：

```python
from collections.abc import Iterator

import audio_pb2
import grpc
import speech_pb2

@provider.grpc("robonix/service/speech/wake_word")
def detect_wake_word(
    request_iterator: Iterator[audio_pb2.AudioChunk],
    context: grpc.ServicerContext,
) -> speech_pb2.DetectWakeWord_Response:
    keyword = detector.detect(
        bytes(chunk.data)
        for chunk in request_iterator
        if context.is_active() and chunk.data
    )
    return speech_pb2.DetectWakeWord_Response(
        detected=bool(keyword),
        keyword=keyword or "",
    )
```

调用方把任意可迭代对象传给 Stub；迭代结束表示客户端完成发送：

```python
import audio_pb2
import robonix_contracts_pb2_grpc as contracts_grpc

def audio_chunks():
    for sequence, pcm in enumerate(microphone.frames()):
        yield audio_pb2.AudioChunk(data=pcm, sequence=sequence)

stub = contracts_grpc.RobonixServiceSpeechWakeWordStub(rpc_channel)
response = stub.DetectWakeWord(audio_chunks(), timeout=30.0)
print(response.keyword)
```

#### 双向流式 RPC

`robonix/service/speech/asr_stream` 的请求段和响应段各有一个具名消息字段，因此生成：

```proto
rpc RecognizeStream(stream robonix.asr.AsrAudioChunk)
    returns (stream robonix.asr.RecognizeStreamEvent);
```

提供方可以消费若干输入后产生一个结果；两侧消息不要求一一对应：

```python
from collections.abc import Iterator

import asr_pb2
import grpc

@provider.grpc("robonix/service/speech/asr_stream")
def recognize_stream(
    request_iterator: Iterator[asr_pb2.AsrAudioChunk],
    context: grpc.ServicerContext,
) -> Iterator[asr_pb2.RecognizeStreamEvent]:
    decoder = StreamingDecoder()
    for request in request_iterator:
        if not context.is_active():
            return
        decoder.feed(request.chunk.data)
        partial = decoder.partial_text()
        if partial:
            yield asr_pb2.RecognizeStreamEvent(
                event_type=asr_pb2.RecognizeStreamEvent.PARTIAL,
                text=partial,
                is_final=False,
            )
    yield asr_pb2.RecognizeStreamEvent(
        event_type=asr_pb2.RecognizeStreamEvent.FINAL,
        text=decoder.final_text(),
        is_final=True,
    )
```

调用方传入请求迭代器，同时遍历返回的响应迭代器：

```python
import asr_pb2
import audio_pb2
import robonix_contracts_pb2_grpc as contracts_grpc

def asr_requests():
    for sequence, pcm in enumerate(microphone.frames()):
        yield asr_pb2.AsrAudioChunk(
            chunk=audio_pb2.AudioChunk(data=pcm, sequence=sequence)
        )

stub = contracts_grpc.RobonixServiceSpeechAsrStreamStub(rpc_channel)
for event in stub.RecognizeStream(asr_requests(), timeout=60.0):
    print(event.text, event.is_final)
```

建立三类流式调用的 Atlas 连接和 `rpc_channel` 与一元 RPC 示例相同。示例中的 `synthesizer`、`detector`、`decoder`、`microphone` 和 `speaker` 是软件包自己的业务对象；Robonix 固定的是处理函数形态、生成消息类型、Stub 以及能力发现和连接流程。服务端需要返回错误时，优先使用 `context.abort(grpc.StatusCode.INVALID_ARGUMENT, "...")`；该调用会抛出终止 RPC 的异常，因此后面不应再 `return` 或 `yield`。

## 关闭行为

装饰器只在导入阶段登记处理函数，不会自行监听端口。`provider.bootstrap()` 按以下顺序完成非阻塞启动：

1. 向 Atlas 注册提供方；
2. 创建共享 `robonix/lifecycle/driver`，并把 `@provider.grpc` 处理函数绑定到生成的 Servicer；
3. 监听 gRPC 端口并向 Atlas 声明这些能力；
4. 启动 MCP HTTP 端点并声明 `@provider.mcp` 能力；
5. 启动心跳；
6. 等待启动器通过 Driver 发送初始化和激活命令。回调缺失时 Driver 记录警告并执行空操作；提供方仍保留唯一的共享 Driver。

:::warning[后向兼容：已有命名空间 Driver]
旧软件包若在清单中精确声明 `<provider-namespace>/driver`，则继续按[兼容流程](../integration-guide/packaging-spec.md#42-已有命名空间-driver-的兼容流程)绑定完整的旧生成服务，或在满足单向迁移条件时使用共享运行时 Driver。该方式计划迁移；新软件包不要照此创建 Driver TOML。
:::

`provider.run()` 先执行同一套 bootstrap，再阻塞等待退出信号。Driver 的 `CMD_SHUTDOWN` 会先完成业务关闭回调和响应，再停止提供方；进程信号路径也会调用 `on_shutdown`。框架会关闭通过 `connect_capability` 建立的通道、受管子进程和 gRPC server。软件包自行创建的线程、设备句柄和后台任务，仍必须在生命周期回调中释放。

