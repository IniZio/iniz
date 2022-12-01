import { setFlagsFromString, writeHeapSnapshot } from "v8";
import vm from "vm";

setFlagsFromString("--expose_gc");
var gc = vm.runInNewContext("gc");

export function measureHeap(name: string, callback: () => void) {
  const before = ".heapshots/" + name + ".before.heapsnapshot";
  const after = ".heapshots/" + name + ".after.heapsnapshot";

  writeHeapSnapshot(before);
  callback();
  gc();
  writeHeapSnapshot(after);
}
