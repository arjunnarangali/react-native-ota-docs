---
layout: home
pageClass: ota-home

hero:
  text: Ship JavaScript without shipping a new binary.
  tagline: Signed React Native releases, verified on device before activation and rolled back when they fail health checks.
  image:
    src: /release-gate.svg
    alt: A signed release manifest passes verification before staging and activation.
  actions:
    - theme: brand
      text: Install the client
      link: /guide/installation
    - theme: alt
      text: Run the server
      link: /server/local-setup
---

<section class="ota-scope" aria-labelledby="ota-scope-title">
  <div class="ota-section-intro">
    <p class="ota-section-label">Update boundary</p>
    <h2 id="ota-scope-title">Update JavaScript over the air. Ship native changes in a new binary.</h2>
    <p>Every release is tied to the native runtime that built it. The client rejects bundles that do not match the installed app.</p>
  </div>

  <div class="ota-scope-grid">
    <article class="ota-scope-lane ota-scope-lane--updates">
      <p class="ota-scope-state">Over the air</p>
      <h3>JavaScript and bundled assets</h3>
      <p>Publish JavaScript and Metro assets for an app, runtime version, and channel already installed on the device.</p>
    </article>
    <article class="ota-scope-lane ota-scope-lane--binary">
      <p class="ota-scope-state">New binary</p>
      <h3>Changes to the native runtime</h3>
      <p>Native code, permissions, entitlements, React Native or Hermes versions, and Codegen contracts ship in a new APK or IPA.</p>
    </article>
  </div>
</section>

<section class="ota-paths" aria-labelledby="ota-paths-title">
  <div class="ota-section-intro">
    <h2 id="ota-paths-title">Choose a path</h2>
  </div>

  <div class="ota-path-list">
    <a class="ota-path" href="/guide/installation">
      <span class="ota-path-title">Install the client</span>
      <span class="ota-path-description">Add the native SDK to an Android and iOS app.</span>
      <span class="ota-path-action">Open installation guide</span>
    </a>
    <a class="ota-path" href="/server/local-setup">
      <span class="ota-path-title">Run the server</span>
      <span class="ota-path-description">Set up the API, database, release storage, and publishing tools.</span>
      <span class="ota-path-action">Open local setup</span>
    </a>
    <a class="ota-path" href="/server/api">
      <span class="ota-path-title">Read the API contract</span>
      <span class="ota-path-description">Review check, publish, rollout, and rollback requests.</span>
      <span class="ota-path-action">Open API reference</span>
    </a>
  </div>
</section>

<section class="ota-install" aria-labelledby="ota-install-title">
  <div>
    <p class="ota-section-label">Quick install</p>
    <h2 id="ota-install-title">Add the client package</h2>
    <p>Autolinking discovers the native modules. Rebuild the app after installation; Metro alone cannot add native code.</p>
    <a href="/guide/installation">Read the full installation guide</a>
  </div>
  <pre class="ota-install-command"><code>npm install react-native-ota-client</code></pre>
</section>
