import * as AABBOverlapDemo from "./aabb-overlap";
import * as AABBSoupDemo from "./aabb-soup";
import * as CircleCollisions from "./circle-collisions";
import * as EdgeCollisions from "./edge-collisions";

const qs = new URLSearchParams(window.location.search);
const demoName = qs.get("demo");

const demos = new Map<string, { start: () => void; stop?: () => void }>([
  ["AABB Overlap Demo", AABBOverlapDemo],
  ["AABB Soup Demo", AABBSoupDemo],
  ["Circle Collisions", CircleCollisions],
  ["Edge Collisions", EdgeCollisions]
]);

if (demoName && demos.has(demoName)) {
  demos.get(demoName)!.start();
} else {
  const names = Array.from(demos.keys());

  const li = (name: string) => `
    <li><a href="/?demo=${encodeURIComponent(name)}">${name}</a></li>
  `;

  const html = `
    <ul>
      ${names.map(name => li(name)).join("\n")}
    </ul>
  `;
  const el = document.createElement("div");
  el.innerHTML = html;
  document.body.appendChild(el);
}
