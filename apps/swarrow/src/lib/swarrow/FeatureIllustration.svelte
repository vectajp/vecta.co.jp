<script lang="ts">
  import type { FeatureIcon } from "./landingPages";

  const uid = $props.id();

  let { kind }: { kind: FeatureIcon } = $props();
</script>

<svg viewBox="0 0 140 140" fill="none" aria-hidden="true">
  <defs>
    <linearGradient
      id={`blue-${uid}`}
      x1="28"
      y1="25"
      x2="110"
      y2="116"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#75d3f6" />
      <stop offset="1" stop-color="#0871b7" />
    </linearGradient>
    <linearGradient
      id={`green-${uid}`}
      x1="35"
      y1="30"
      x2="112"
      y2="115"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#b2dbad" />
      <stop offset="1" stop-color="#5c9d65" />
    </linearGradient>
  </defs>
  <circle
    cx="70"
    cy="70"
    r="64"
    fill={kind === "announce" ? "#e0f2e7" : "#ddf1fc"}
  />
  {#if kind === "chat"}
    <path
      d="M44 48h67a9 9 0 0 1 9 9v36a9 9 0 0 1-9 9H92l-15 13v-13H44a9 9 0 0 1-9-9V57a9 9 0 0 1 9-9Z"
      fill="#a4cadd"
    />
    <path
      d="M31 32h67a10 10 0 0 1 10 10v39a10 10 0 0 1-10 10H60l-20 17V91h-9a10 10 0 0 1-10-10V42a10 10 0 0 1 10-10Z"
      fill={`url(#blue-${uid})`}
    />
    <g fill="white">
      <circle cx="44" cy="62" r="5" />
      <circle cx="65" cy="62" r="5" />
      <circle cx="86" cy="62" r="5" />
    </g>
  {:else if kind === "announce"}
    <path d="m48 72 13 36-14 5-15-36" fill="#50825b" />
    <path
      d="M27 51h26l46-22v69L53 77H27a8 8 0 0 1-8-8V59a8 8 0 0 1 8-8Z"
      fill={`url(#green-${uid})`}
    />
    <path
      d="M53 51v26M109 39l9-8m-5 29h12m-16 21 9 8"
      stroke="#77aa78"
      stroke-width="6"
      stroke-linecap="round"
    />
  {:else if kind === "publish"}
    <rect
      x="18"
      y="27"
      width="101"
      height="73"
      rx="8"
      fill={`url(#blue-${uid})`}
    />
    <path d="M24 42h89v50H24z" fill="white" />
    <circle cx="30" cy="35" r="2" fill="white" />
    <circle cx="38" cy="35" r="2" fill="white" />
    <path
      d="M61 100v10m-20 1h40"
      stroke="#307ba5"
      stroke-width="6"
      stroke-linecap="round"
    />
    <g stroke="#2998cb" stroke-width="3">
      <circle cx="68" cy="66" r="19" />
      <ellipse cx="68" cy="66" rx="9" ry="19" />
      <path d="M49 66h38m-34-10h30m-30 20h30" />
    </g>
    <path
      d="M92 79h29a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8h-11l-10 9v-9h-8a8 8 0 0 1-8-8V87a8 8 0 0 1 8-8Z"
      fill="#36afb2"
      stroke="white"
      stroke-width="3"
    />
    <g fill="white">
      <circle cx="96" cy="96" r="2.5" />
      <circle cx="107" cy="96" r="2.5" />
      <circle cx="118" cy="96" r="2.5" />
    </g>
  {:else}
    <rect
      x="32"
      y="21"
      width="75"
      height="98"
      rx="8"
      fill={`url(#blue-${uid})`}
    />
    <rect x="39" y="28" width="61" height="84" rx="4" fill="white" />
    <path
      d="M51 44h35M51 57h35M51 70h24M51 83h19"
      stroke="#61b6d9"
      stroke-width="5"
      stroke-linecap="round"
    />
    {#if kind === "review"}
      <circle
        cx="95"
        cy="91"
        r="21"
        fill="#edf7ff"
        stroke="#267bad"
        stroke-width="7"
      />
      <path
        d="m111 108 15 15"
        stroke="#267bad"
        stroke-width="8"
        stroke-linecap="round"
      />
    {:else if kind === "approval"}
      <path
        d="m96 68 25 9v18c0 16-25 29-25 29S71 111 71 95V77Z"
        fill="#187ab5"
        stroke="white"
        stroke-width="4"
      />
      <path
        d="m84 93 9 9 17-20"
        stroke="white"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    {:else}
      <rect x="17" y="76" width="57" height="38" rx="5" fill="#187ab5" />
      <text
        x="45"
        y="101"
        fill="white"
        text-anchor="middle"
        font-size="18"
        font-weight="700"
      >
        PDF
      </text>
      <rect
        x="81"
        y="83"
        width="43"
        height="31"
        rx="5"
        fill="#78a966"
        stroke="white"
        stroke-width="3"
      />
      <path d="m85 108 12-15 8 9 6-6 9 12" fill="white" />
      <circle cx="111" cy="91" r="3" fill="white" />
    {/if}
  {/if}
</svg>

<style>
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
</style>
