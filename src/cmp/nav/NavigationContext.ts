
import { Graph, Node as GCNode } from '@greycat/greycat';

class NavigationContext {
  graph: Graph;
  world: number;
  time: number;
  onNodeSelected?: (n: GCNode) => void;
  visibilityLimit?: number = 10;
}
export default NavigationContext;