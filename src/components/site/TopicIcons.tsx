// The six topic drawings and the open plot, as one SVG sprite (from Front Page Draft 3, icons.html).
// 96 x 64 each, ground at y = 64. k: outline on paper. kt: outline on the one shaded plane.
// kf: outline, no fill. kn: detail line. Strokes do not scale.
export function TopicSprite() {
  return (
    <svg className="sprite" width="0" height="0" aria-hidden="true" focusable="false">
      <symbol id="ic-growing" viewBox="0 0 96 64">
        <path className="kf" d="M3 34l11-4q15-8 30 0q15-8 30 0" />
        <path className="kn" d="M14 30l8 4.5h14l8-4.5l8 4.5h14l6-3.4M3 34v4M22 34.5v8M29 34.5v8M36 34.5v8M52 34.5v8M59 34.5v8M66 34.5v8" />
        <path className="kf" d="M14 30L8 57M14 30l6 27M8 57h12M44 30l-6 27M44 30l6 27M38 57h12" />
        <circle className="k" cx="8" cy="60" r="3.6" />
        <circle className="k" cx="20" cy="60" r="3.6" />
        <circle className="k" cx="38" cy="60" r="3.6" />
        <circle className="k" cx="50" cy="60" r="3.6" />
        <path className="kn" d="M26 64v-4M29 64v-4M32 64v-4M56 64v-4M59 64v-4M62 64v-4M65 64v-4" />
        <path className="kt" d="M72 64V24a8 8 0 0 1 16 0v40z" />
        <path className="kn" d="M72 36h16M72 48h16" />
      </symbol>
      <symbol id="ic-building" viewBox="0 0 96 64">
        <path className="kf" d="M12 64V34h60v30M8 34L42 12l34 22" />
        <path className="kn" d="M22 34v30M32 34v30M42 12v52M52 34v30M62 34v30M42 34L27 21.7M42 34l15-12.3M12 64l20-30" />
        <path className="kf" d="M82 64L72 24M90 64L80 24" />
        <path className="kn" d="M80 56h8M78 48h8M76 40h8M74 32h8" />
      </symbol>
      <symbol id="ic-making" viewBox="0 0 96 64">
        <path className="k" d="M12 64V32h72v32z" />
        <path className="kt" d="M12 32l18-14v14zM30 32l18-14v14zM48 32l18-14v14zM66 32l18-14v14z" />
        <path className="k" d="M20 64V43h26v21" />
        <path className="kn" d="M20 48.5h26M20 54h26M20 59.5h26M56 43h20v12H56zM66 43v12" />
      </symbol>
      <symbol id="ic-fixing" viewBox="0 0 96 64">
        <path className="k" d="M8 64V24h80v40z" />
        <path className="kt" d="M5 26h86v-8H5zM18 64V34h60v30" />
        <path className="k" d="M24 64V37h4v27M68 64V37h4v27" />
        <path className="kn" d="M28 51.5h40" />
        <path className="k" d="M32 51v-5l4-1 4-6h14l5 6 5 1v5z" />
        <path className="kn" d="M41.5 45l2.5-3.5h9l3 3.5z" />
        <circle className="k" cx="39" cy="52" r="3.5" />
        <circle className="k" cx="57" cy="52" r="3.5" />
      </symbol>
      <symbol id="ic-feeding" viewBox="0 0 96 64">
        <path className="kn" d="M63 10c-3-2.5 3-4.5 0-8M70 10c-3-2.5 3-4.5 0-8" />
        <path className="k" d="M61 34V19h11v15M56 19h21l-3.5-5.5h-14z" />
        <path className="k" d="M8 64V36h80v28z" />
        <path className="kt" d="M4 41h88l-5-10H9z" />
        <path className="kn" d="M24.5 31l-1.5 10M36.5 31l-.8 10M48 31v10M59.5 31l.8 10M71.5 31l1.5 10" />
        <path className="kn" d="M14 47h44v10H14zM28.7 47v10M43.3 47v10M66 64V47h14v17M70 50.5h6v5h-6z" />
      </symbol>
      <symbol id="ic-living" viewBox="0 0 96 64">
        <path className="k" d="M76 26V12h6v18" />
        <path className="k" d="M46 64V34h42v30z" />
        <path className="kt" d="M42 36l25-22 25 22z" />
        <path className="kn" d="M72 42h10v10H72zM77 42v10M72 47h10M52 58V42h11v16" />
        <path className="k" d="M4 64l38-6h26v6z" />
        <path className="kf" d="M5 55l37-6h10" />
        <path className="kn" d="M6 63.7v-8.8M24 60.8v-8.9M42 58v-9M52 58v-9" />
      </symbol>
      <symbol id="ic-open" viewBox="0 0 96 64">
        <path className="kn" d="M30 64V40l18-13 18 13v24M12 64v-7M84 64v-7" />
      </symbol>
    </svg>
  );
}

export function TopicIcon({ id, className, dashed }: { id: string; className?: string; dashed?: boolean }) {
  return (
    <svg
      className={['ic', className, dashed ? 'dash' : ''].filter(Boolean).join(' ')}
      viewBox="0 0 96 64"
      aria-hidden="true"
      focusable="false"
    >
      <use href={`#ic-${id}`} />
    </svg>
  );
}
