
import { Graph, Node as GCNode } from 'greycat';

class NavigationContext {
  graph: Graph;
  world: number;
  time: number;
  onNodeSelected?: (n: GCNode) => void;
}
export default NavigationContext;