
import { Container, Graph } from '@greycat/greycat';

class NavigationContext {
  graph: Graph;
  world: number;
  time: number;
  onNodeSelected?: (n: Container) => void;
  visibilityLimit?: number = 10;
}
export default NavigationContext;