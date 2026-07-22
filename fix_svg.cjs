const fs = require('fs');
let svg = fs.readFileSync('/Users/shivamsharma/Downloads/file.svg', 'utf8');
// Basic SVG to JSX cleanup
svg = svg.replace(/enable-background="[^"]*"/g, '');
svg = svg.replace(/xml:space="preserve"/g, '');
svg = svg.replace(/xmlns:xlink="[^"]*"/g, '');
svg = svg.replace(/xmlns="[^"]*"/g, '');
svg = svg.replace(/version="1.1"/g, '');
svg = svg.replace(/id="Layer_1"/g, '');
svg = svg.replace(/x="0px" y="0px" width="100%"/g, '');
svg = svg.replace(/<svg\s+viewBox="0 0 612 408"/g, '<svg viewBox="0 0 612 408" className={className} style={style}');
svg = svg.replace(/<path/g, '<path'); // Just to be safe
const componentCode = `export const SewingMachine = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (\n${svg}\n);`;
fs.writeFileSync('/Users/shivamsharma/Downloads/maisone-ai-sourcing-edge-main/src/components/maisone/SewingMachineIcon.tsx', componentCode);
