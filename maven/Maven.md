### Maven

1. 父工程定义的dependence 子项目会继承

2. BOM https://www.cnblogs.com/niceshot/p/13747547.html

   BOM全称是Bill Of Materials，译作材料清单。BOM本身并不是一种特殊的文件格式，而是一个普通的POM文件，只是在这个POM中，我们罗列的是一个工程的所有依赖和其对应的版本。该文件一般被其它工程使用，当其它工程引用BOM中罗列的jar包时，不用显示指定具体的版本，会自动使用BOM对应的jar版本。

   - `<packaging>pom</packaging>`打包方式是pom文件

   - `<dependencyManagement><dependencies>`下定义的各种依赖的版本

   - 依赖方式 1 通过parent. 2 通过<dependencyManagement>

     ![img](https://img2020.cnblogs.com/blog/2007268/202009/2007268-20200928234252655-2111778534.png)

3. 子组件是否继承父组件的properties属性。

   否。在子项目中不能使用父项目定义的properties。但是子组件可以覆盖父组件定义的properties值。

4. 在父项目的 dependencyManagement->dependencies 引入的jar文件，在子项目没有实际引用的时候不进行下载（显示红色）。

5. 多模块项目，主项目打包时，提示找不到子模块。

   * 子模块pom文件配置打包行为如下：

     ```xml
     <build>
             <plugins>
                 <plugin>
                     <groupId>org.springframework.boot</groupId>
                     <artifactId>spring-boot-maven-plugin</artifactId>
                     <configuration>
                         <skip>true</skip>
                     </configuration>
                 </plugin>
             </plugins>
         </build>
     ```

   * 在项目根路径下执行：

     ```bash
     mvn clean install
     mvn dependency:tree
     ```

   * 然后再在主文件上执行：**package **命令

6. 出现打包后文件很小，以及报 `*no main manifest attribute*`错误

   ```xml
   <!--添加插件-->
   <build>
       <plugins>
           <plugin>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-maven-plugin</artifactId>
               <configuration>
                   <mainClass>com.baeldung.demo.DemoApplication</mainClass>
                   <layout>JAR</layout>
               </configuration>
           </plugin>
       </plugins>
   </build>
   ```

   

7. 

