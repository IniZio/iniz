import { atom } from "../src/atom";
import { measureHeap } from "./util";

measureHeap("clean", () => {
  Array(1000).fill("some string");
});

let dangling: any;
measureHeap("dangling", () => {
  dangling = Array(1000).fill("some string");
});

measureHeap("atoms", () => {
  for (let i = 0; i < 1000; i++) {
    atom(100);
  }
});
