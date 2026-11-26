<script lang="ts">
  import type { LandingId } from "./landingPages";

  let {
    product,
    image,
    alt,
    width,
    height,
  }: {
    product: LandingId;
    image: string;
    alt: string;
    width: number;
    height: number;
  } = $props();
</script>

<div class="device" class:post={product === "line"}>
  <img
    class="frame"
    src={product === "line" ? "/devices/post-desktop-phone-v3.webp" : "/devices/site-desktop-v3.webp"}
    alt={product === "line" ? "PCとスマートフォンで配信管理とLINE受信を行うイメージ" : ""}
    width="1536"
    height="1024"
    fetchpriority="high"
  >
  <img class="screen" src={image} {alt} {width} {height} fetchpriority="high">
</div>

<style>
  .device {
    position: relative;
    width: 100%;
    aspect-ratio: 1536 / 1024;
  }
  .frame {
    display: block;
    width: 100%;
    height: auto;
  }
  .screen {
    position: absolute;
    left: 8.72%;
    top: 9.28%;
    width: 82.62%;
    height: 63.48%;
    object-fit: cover;
    object-position: center top;
    background: white;
    border-radius: 2px;
  }
  .post .screen {
    left: 5.73%;
    top: 14.65%;
    width: 65.1%;
    height: 55.45%;
  }
</style>
