
import ElementFromRelation from '../../core/ElementFromRelation';

interface TreeItemState {
  children: ElementFromRelation[];
  expanded: boolean;
  expandFully: boolean;
}
export default TreeItemState;