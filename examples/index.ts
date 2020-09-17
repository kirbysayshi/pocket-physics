import * as AABBOverlapDemo from "./aabb-overlap";
import * as AABBSoupDemo from "./aabb-soup";
import * as CircleCollisions from "./circle-collisions";
import * as CircleBoxCollision from "./circle-box-collision";
import * as EdgeCollision from "./edge-collision";
import * as Platformer from "./platformer";
import * as Bucket from "./bucket";
import * as EdgeCollisionAABB from './edge-collision-aabb';

const qs = new URLSearchParams(window.location.search);
const demoName = qs.get("demo");

const demos = new Map<string, { start: () => void; stop?: () => void }>([
  ["Bucket of Circles (Verlet)", Bucket],
  ["Circle Collisions (Verlet)", CircleCollisions],
  ["Circle to Box Collision (Verlet)", CircleBoxCollision],
  ["Single Edge Collision (Verlet)", EdgeCollision],
  ["Platformer (AABB Impulse Model)", Platformer],
  ["AABB Overlap Demo (AABB Impulse Model)", AABBOverlapDemo],
  ["AABB Soup Demo (AABB Impulse Model)", AABBSoupDemo],
  ["Single Edge Collision (AABB Impulse Model)", EdgeCollisionAABB]
]);

if (demoName && demos.has(demoName)) {
  demos.get(demoName)!.start();
} else {
  const names = Array.from(demos.keys());

  const li = (name: string) => {
    const cmp = encodeURIComponent(name);
    const url = `${window.location.pathname}?demo=${cmp}`;
    return `
      <li><a href="${url}">${name}</a></li>
    `;
  };

  const html = `
    <ul>
      ${names.map(name => li(name)).join("\n")}
    </ul>
  `;
  const el = document.createElement("div");
  el.innerHTML = html;
  document.body.appendChild(el);
}
