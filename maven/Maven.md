### Maven

1. 父工程定义的dependence 子项目会继承

2. BOM https://www.cnblogs.com/niceshot/p/13747547.html

   BOM全称是Bill Of Materials，译作材料清单。BOM本身并不是一种特殊的文件格式，而是一个普通的POM文件，只是在这个POM中，我们罗列的是一个工程的所有依赖和其对应的版本。该文件一般被其它工程使用，当其它工程引用BOM中罗列的jar包时，不用显示指定具体的版本，会自动使用BOM对应的jar版本。

   - `<packaging>pom</packaging>`打包方式是pom文件

   - `<dependencyManagement><dependencies>`下定义的各种依赖的版本

   - 依赖方式 1 通过parent. 2 通过<dependencyManagement>

     ![img](https://img2020.cnblogs.com/blog/2007268/202009/2007268-20200928234252655-2111778534.png)

3. 子组件是否继承父组件的properties属性。

   否。在子项目中不能使用父项目定义的properties。

4. 

