import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Mermaid from '@theme-original/Mermaid';
import type {Props} from '@theme/Mermaid';

export default function ExportableMermaid(props: Props) {
  const {siteConfig} = useDocusaurusContext();
  return siteConfig.customFields?.offline
    ? <pre className="mermaid">{props.value}</pre>
    : <Mermaid {...props} />;
}
