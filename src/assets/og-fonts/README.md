# OG image fonts

Static TTF instances used only by `src/lib/og.ts` (Satori cannot read
variable fonts or WOFF2). All three fonts are under the SIL Open Font
License 1.1.

Generated from the variable fonts in google/fonts with fontTools:

```sh
fonttools varLib.instancer "Fraunces[SOFT,WONK,opsz,wght].ttf" \
  wght=350 SOFT=100 opsz=144 WONK=0 -o fraunces-350.ttf
fonttools varLib.instancer "JetBrainsMono[wght].ttf" wght=400 -o jbm-400.ttf

# Latin + Latin Extended-A (Turkish), punctuation and arrows
U="U+0020-007E,U+00A0-00FF,U+0100-017F,U+2010-2027,U+2030-203A,U+2190-2193,U+2212"
pyftsubset fraunces-350.ttf --unicodes="$U" --layout-features=kern,liga \
  --output-file=Fraunces-350-Soft.ttf
pyftsubset jbm-400.ttf --unicodes="$U" --layout-features=kern \
  --output-file=JetBrainsMono-Regular.ttf
pyftsubset Kalam-Regular.ttf --unicodes="$U" --layout-features=kern,liga \
  --output-file=Kalam-Regular.ttf
```
