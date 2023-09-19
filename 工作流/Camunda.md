# Camunda

1. Camunda流程引擎的使用方式：

   Camunda Platform can be used both as a standalone process engine server or embedded inside custom Java applications.

2. Embedded Edition

   * a set of libraries
   * allow access camunda direct with java api
   * no classloading restriction

3. Standalone Edition

   * remote server which could be applicable to the architectures that are not dependent on java
   * does not provide a possibility to touch the core of the engine
   * 

4. camunda版本必须与springboot 版本匹配才行。否则启动没有反应！

5. 一个流程多次部署会怎么样？

   * 流程多次部署会产生多个部署定义。

6. 