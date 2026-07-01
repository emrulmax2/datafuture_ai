<?php

namespace App\Support;

/**
 * Generates an inline "initials" avatar used as a fallback whenever a
 * person (user / student / applicant / agent / employee) has no uploaded
 * profile photo. Returns a self-contained SVG data URI that drops straight
 * into any existing <img src="..."> (and inherits the container's shape, so
 * the usual `rounded-full` slots render it as a circle).
 */
class Avatar
{
    /**
     * Background palette — white text passes WCAG AA on every colour.
     * The brand teal leads so it is the most common tone.
     */
    protected static array $palette = [
        '#0E7C86', // teal (brand)
        '#0D9488', // teal
        '#2563EB', // blue
        '#0891B2', // cyan
        '#4F46E5', // indigo
        '#7C3AED', // violet
        '#9333EA', // purple
        '#DB2777', // pink
        '#DC2626', // red
        '#EA580C', // orange
        '#B45309', // amber
        '#15803D', // green
    ];

    /**
     * Build a data-URI SVG avatar from a person's name (first + last initial).
     */
    public static function initials(?string $name, int $size = 200): string
    {
        $clean = trim(preg_replace('/\s+/', ' ', (string) $name));

        $letters = '?';
        if ($clean !== '') {
            $parts = explode(' ', $clean);
            $first = mb_substr($parts[0], 0, 1);
            $last  = count($parts) > 1 ? mb_substr($parts[count($parts) - 1], 0, 1) : '';
            $letters = mb_strtoupper($first . $last);
        }

        $key  = $clean !== '' ? $clean : 'lcc';
        $bg   = self::$palette[abs(crc32($key)) % count(self::$palette)];
        $font = (int) round($size * (mb_strlen($letters) < 2 ? 0.46 : 0.42));

        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' . $size . '" height="' . $size . '" viewBox="0 0 ' . $size . ' ' . $size . '">'
             . '<rect width="' . $size . '" height="' . $size . '" fill="' . $bg . '"/>'
             . '<text x="50%" y="50%" dy="0.35em" text-anchor="middle" '
             . 'font-family="Arial, Helvetica, sans-serif" font-size="' . $font . '" '
             . 'font-weight="600" fill="#ffffff">' . htmlspecialchars($letters, ENT_QUOTES) . '</text>'
             . '</svg>';

        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }
}
