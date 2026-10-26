# B15 independent auditor authoring record

This implementation was authored in `/workspace/blind-b15` before any existing
B15 runtime, checker, Python oracle, PNG decoder, fixture, mutation or generator
source was opened. No original icon SVG source or generated raster was read
before authoring. No helpers or code from the existing job were imported.

Permitted information read was the B15 section of the original PROMPTS.md,
the previously read repository root README, file names and branch metadata, and
the existing PR's public high-level measurement/delivery description. The parent
supplied the complete SVG/PNG/mask profile as a public mathematical/schema
contract. That public summary was read; no claim of hiding public measurements
or API requirements is made. The implementations themselves were not viewed.

The source independently uses Python standard-library ElementTree for XML,
explicit lexical/profile validation, zlib and CRC for PNG chunks, and a custom
row-filter decoder for RGB/RGBA 8-bit noninterlaced PNG. Its alpha mask packing
uses little bit order and alpha>=128. Intersection/union uses integer bit counts;
the strict threshold uses exact integer multiplication, including safe-integer
boundary cases. No mask transforms, alignment, cropping or hole filling occur.

The PNG reference follows the supplied standard: IHDR first/single/13 bytes,
positive dimensions, supported methods, CRC on every chunk, contiguous IDAT,
exact decompression length, IEND last/empty and no trailing bytes. Unknown
critical chunks are rejected; supported ancillary chunks are validated or
ignored. Valid optional truecolor PLTE and RGB tRNS are supported. Existing
implementation defects discovered by the later differential phase must be fixed
in production rather than weakening this independent standard reference.

Run `python3 selfcheck.py` in this directory. The author self-checks use new
elementary SVG geometry and manually derived golden row-filter byte sequences;
no B15 art or existing fixture was copied. `SELFCHECK.json` records actual
counts. Sources and evidence are sealed before parent integration begins.

## JSON-lines protocol

One JSON object per stdin line, one reply per stdout line:

- `{"op":"svg","text":"..."}` returns `valid,bytes,colors,shapes,issues`.
- `{"op":"png","data":"BASE64"}` returns `valid,width,height,rgba` (base64)
  or `valid:false,error` for malformed/unsupported PNG.
- `{"op":"alpha","data":"BASE64_RGBA"}` returns `valid,words`; invalid
  input byte count yields `valid:false,words:null`.
- `{"op":"compare","a":[uint32,...],"b":[uint32,...]}` returns `valid,result`
  where result is `intersection,union,iou`, or null for unequal lengths.
- `{"op":"limit","intersection":i,"union":u}` returns `below`, requiring
  safe integers, `0<=i<=u`, `u>0` and strictly `5*i<4*u`.

Malformed SVG issue strings and metadata need not match another implementation;
acceptance behavior is compared, and valid SVG metadata is compared exactly.
The parent adapter may call these pure Python functions directly for large
bulk audits, or use the JSON-lines process for existing TypeScript fixtures.
