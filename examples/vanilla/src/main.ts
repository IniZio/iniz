// import { atom, computed } from '@iniz/core';

// const s = atom(5);

// for (let i = 0; i < 100000; ++i) {
//     {
//         const c = computed(() => {
//             return s();
//         });

//         c();
//     }
// }

// object creation
let x = new Array(1000).fill(true);

// constructing the finalizer method
const cleanup = new FinalizationRegistry((key) => {
  // cleanup code should go here
});

// hooking the x variable to the finalizer
cleanup.register(x, { useful: "info about target" });

// object 'x' is now unreachable, finalizer callback might happen after
// object has been garbage collected
x = null;

export {};
