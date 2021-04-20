import { BehaviorSubject } from 'rxjs';

export const globalState = new BehaviorSubject({
    currentFacetId: -1,
    branchFacetId: -1,
    expandedFacetId: '-2,-2',
    init: false,
});

export const globalData = {
    treeData: null,
};

export const globalBranch = new BehaviorSubject({
    currentFacetId: -1,
    expandedFacetId: '-2,-2',
    init: false,
});