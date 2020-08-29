
// http://mmacklin.com/uppfrta_preprint.pdf
// function tick () {
//   // "Agorithm 1"

//   const predictions = Array(particles.length);
//   const velocities = Array(particles.length);

//   for (let i = 0; i < particles.length; i++) {
//     // apply forces / accelerate
//     velocities[i] = sub(v2(), particles[i].cpos, particles[i].ppos);
//     velocities[i] = add(velocities[i], velocities[i], scale(v2(), particles[i].acel, dt))
//     // predict position
//     predictions[i] = add(v2(), particles[i].cpos, velocities[i]);
//     // apply mass scaling ???
//   }

//   for (let i = 0; i < particles.length; i++) {
//     // find neighboring particles using the predicted positions
//     // find solid contacts
//   }

//   let stabilityIterations = 2;
//   while (stabilityIterations--) {
//     // solve solid contact constraints, summing up deltas
//     // apply the (delta / numConstraints) to both predicted position and current position
//   }

//   let solverIterations = 2;
//   while (solverIterations--) [
//     // for each constraint type (group): distance, density, shape, etc
//       // solve all constraints, sum up deltas 
//       // apply (delta / numConstrants) to predicted position
//   ]

//   for (let i = 0; i < particles.length; i++) {
//     // update velocity 
//     // advect diffuse particles...
//     // apply internal forces (drag, vort)
//     // update positions to predicted positions, or apply sleeping
//   }
// }