# Activiti

## 问题：

1. activiti流程中，驳回怎么处理？

   如果每一步驳回都要单独处理，是否繁琐。即：通过排他网关的方式。

   * 整个流程图变复杂。

   驳回操作，使用类似的task.complete的方式，直接返回上一个流程节点。

   **总结**：

   * 认为应该选择第二种方式进行处理，流程图中每一个节点其实都需要这样的操作，这应该是流程图的通用操作。

2. 