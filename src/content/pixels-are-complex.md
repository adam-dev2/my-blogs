---
title: "Pixels are more complex than I thought"
slug: "pixels-are-more-complex-than-i-thought"
createdAt: "2026-04-28"
updatedAt: "2026-05-03"
---

## Understanding Bits & Bytes

Bit is the smallest unit of storage—it can be either 1 or 0.

8 bits equals 1 byte, which gives us 2^8 = 256 possible values in a single byte.
## Color Encoding: RGB

Uncompressed images use the RGB (Red, Green, Blue) color model:
- R = 8 bits
- G = 8 bits  
- B = 8 bits

Each pixel = 8 + 8 + 8 = 24 bits = 3 bytes

## Storage Units

**Decimal (metric):** megabyte (MB) = 10^6 bytes  
**Binary:** mebibyte (MiB) = 2^20 bytes

1 MiB ≈ 1.05 MB

## Real-World Example: Video File Size

**1080p** (Full HD) is also known as progressive scan—1920 × 1080 resolution.

Let's calculate the uncompressed size of a 10-second FHD video at 30 fps:

**Per frame:**
- Resolution: 1920 × 1080 = 2,073,600 pixels 
- Color depth: 24-bit (RGB)
- Bytes per frame: 2,073,600 pixels × 3 bytes = ~6.2 MB

**Per second:** 30 frames × 6.2 MB = ~186 MB/s

**10 seconds:** 186 MB/s × 10s = ~1,860 MB ≈ 1.8 GiB

> **Note:** This is uncompressed RAW video. Real-world video files use compression (H.264, H.265, VP9, etc.) to reduce this dramatically—typically 10-100x smaller.

