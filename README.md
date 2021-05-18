# Facet Tree Visualization

## Input and output
- Input: Hierarchical data of a topic

drawTree函数中：
1. `svg` 画树的svg
2. `data` 画树的数据
3. `FacetMenuDisplay` 是否弹出菜单及菜单内容
4. `time` 动态画树间隔时间
5. `alertFlag` 构建完成是否弹窗

drawtreeNumber函数中：
1. `svg` 画树的svg
2. `data` 画树的数据
3. `FacetMenuDisplay` 是否弹出菜单及菜单内容


画树数据如下：
![输入图片说明](https://images.gitee.com/uploads/images/2021/0511/191449_588c770b_8849316.png "屏幕截图.png")
- Output: Data is visualized as a faceted tree

![输入图片说明](https://images.gitee.com/uploads/images/2021/0511/191533_7569af5f_8849316.png "屏幕截图.png")

## Build
`npm run pack` 打包结果在 `/module/facetTree.js`

## Usage
1. download `facetTree.js` from `release` tab
2. import `drawTree` (refer to `index.ts`)
3. define your own click func ( like `clickFacet` in `index.ts` )
4. transfer `dom, treeData, clickFunc` to `drawTree`

## Structure
> `facetId = -1` means the facet is an aggregation of facets

### src/facet-tree-ng.ts

- 变量
1. `palettes` 调色板（二维数组）
2. `ColorNo`
3. `minFacetFontSize`
4. `maxFacetFontSize`
5. `weightSecondFacet`
6. `weightFirstLayerVideo`
7. `weightFirstLayerRichText`
8. `weightSecondLayerVideo`
9. `weightSecondLayerRichText`
10. `branchRate`
11. `branchIntervalRate`
12. `branchWidthRate`
13. `firstLayerThreshold`
14. `secondLayerThreshold`
15. `FacetMenuDisplay` 是否弹出菜单及菜单内容
16. `time` 动态画树间隔时间
17. `alertFlag` 构建完成是否弹窗

- 函数

1. `camelSort`
2. `calcWeight` 计算分面权重
3. `calcFacetChart`
4. `buildTree`

### src/draw-tree.ts

### src/facet-force-layout.ts

### src/facet-pie-chart.ts

### src/index.ts

### src/state.ts

### src/tools/utils.ts
