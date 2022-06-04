# MyBatis

#### 一. 日常问题记录

1. updateById方法 只会更新设置的属性,未设置属性不会更新.如:user 对象只设置了name,没设置age,执行的时候只会更新name字段,而不会把age设置为null

2. dao模块中不能进行逻辑处理,只能写SQL语句

3. mysql中的日期时间格式

   * Date,存储 YYYY-MM-DD,范围为'1000-01-01'到'9999-12-31'
   * DateTime 存储 YYYY-MM-DD HH:MM:SS,范围为'1000-01-01 00:00:00'到'9999-12-31 23:59:59'
   * Timestamp 从1970-01-01 00:00:00到当前的时间差值,精确到毫秒级别，范围为：1970-01-01 00:00:00 到 2037年
   * Time 存储 HH:MM:SS
   * Year 存储 YYYY

4. mybatis-plus逻辑删除

   * xml配置(注意配置的是**实体**字段名):

     ```yml
     mybatis-plus:
       global-config:
         db-config:
           logic-delete-field: isDel # 全局逻辑删除的实体字段名(since 3.3.0,配置后可以忽略不配置步骤2)
           logic-delete-value: 1 # 逻辑已删除值(默认为 1)
           logic-not-delete-value: 0 # 逻辑未删除值(默认为 0)
     ```

     

   * 逻辑删除**只对自动注入的 sql 起效**,写在xml里的需要自己加条件判断

   * 对于没有逻辑删除设定的表(有些表不需要逻辑删除):仍然按照物理删除的逻辑走

   * 

5. mysql **TIMESTAMPDIFF** 函数可用来判断日期是否相等

   ```sql
   		select *
           from car_application
           where TIMESTAMPDIFF(DAY, ts_create, now()) = 0
           order by id desc
           limit 1
   ```

   

6. 如何在repository模块下进行测试?

7. 如何扩展mybatis-plus 的 BaseMapper<T>加入自己的方法 getForUpdate

8. foreach

   ```xml
   <foreach item="item" index="index" collection="queryConditionVO.roleIds"
            open=" and role_id in (" separator="," close=")" nullable="true">
       #{item}
   </foreach>
   # nullable="true" 指示queryConditionVO.roleIds可以为空
   # open=" and role_id in (" 避免数据空时出现的 and role_id in ( bug
   ```

9. insert只会保存设置的值,不会保存未设置的值!

10. 事务配置通用规则,并且要求方法可以自定义!

   要求实现的功能:

   * 可以配置通用事务处理规则,将find* , select* , list*,...配置成默认read-only事务,将剩余方法配置成默认事务

   * 同时支持方法自定义自己事务!(可以覆盖通用配置!)

     测试情况:

     **结论**:``` TxAdviceInterceptor ```设置事务生效

     1. 使用全局``` TxAdviceInterceptor ```并且设置rollback=Exception.class,目标xxxServiceImpl类上方法上没有设置@Transactional

        预期:

        1. 方法发生```1/0``` 异常,发生回滚 ( √ )
        2. 方法抛出Exception.发生回滚 ( √ )

     2. 注释``` TxAdviceInterceptor ``` 类,且目标xxxServiceImpl类上方法上没有设置@Transactional

        预期:

        1. 方法发生```1/0``` 异常,保存入数据库,没有回滚 ( √ )
        2. 方法抛出Exception,保存入数据库,没有回滚 ( √ )

     3. 使用全局``` TxAdviceInterceptor ```,并且在抛出Exception.class的方法上设置```@Transactional(rollbackFor = RuntimeException.class)```

        预期:

        1. **方法上```@Transactional```注解覆盖全局设置的,没有发生回滚 ( × )**

     4. 使用全局``` TxAdviceInterceptor ```,并在方法上设置```@Transactional(propagation = Propagation.REQUIRES_NEW)```

        预期:

        1. 方法上开启新的事务,外部方法回滚,内部提交成功( √ )

     5. 

11. spring+mybatis事务的readonly属性无效

12. spring事务管理中,同一个类的 Propagation.REQUIRES_NEW 不会生效!需要调用别的类的标有Propagation.REQUIRES_NEW的方法.或者使用从beanFactory中获取bean SpringContextUtil.getBean(…)

    重新获取一个对象

    ```java
    @Override
    public void saveNestTransaction(long id) throws Exception {
        Employee employee = baseMapper.selectById(id);
        int status = (employee.getStatus()+1)%2;
        System.out.println("@@@@@status:" + status);
        employee.setStatus(status);
        baseMapper.updateById(employee);
    
        TestTransactionService testTransactionService =       (TestTransactionService)applicationContext.getBean("testTransactionServiceImpl");
        System.out.println("----bean对象:" + testTransactionService);
        testTransactionService.saveRequireNew(id);
        throw new Exception("test");
    }
    
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveRequireNew(long id) {
        Employee employee = baseMapper.selectById(64L);
        String newName = employee.getName()+"@";
        System.out.println("#####newName:" + newName);
        employee.setName(newName);
        baseMapper.updateById(employee);
    }
    ```

13. spring事务无法对 private方法生效,但是private方法内发生异常,外部方法的操作会回滚

14. service异常为Exception 时,设置rollback = Exception.class 会将Exception转换为 `org.springframework.transaction.UnexpectedRollbackException` 异常,导致自定义的异常在Controller中无法捕获(因为此时的异常已经是`UnexpectedRollbackException`)

    * 现在处理方式为将自定义异常转为从RuntimeException类进行继承

15. 

