import React from 'react';
import Link from '@docusaurus/Link';
import {Redirect, useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

// Keep existing overview bookmarks, including their section anchors.
export default function OverviewRedirect() {
  const {search, hash} = useLocation();
  const target = `${useBaseUrl('/')}${search}${hash}`;

  return (
    <Layout title="认识 Robonix">
      <Redirect to={target} />
      <main className="container margin-vert--lg">
        <p>本页已合并到<Link to={target}>手册首页：认识 Robonix</Link>。</p>
      </main>
    </Layout>
  );
}
