### vue

#### 1. webpack相关

#### 2. vue-axios:

1. 作用：

2. 精度丢失问题，当后台传过来的数据为Long值，且过大时会发生精度丢失的问题。

   ```ts
   //安装json-bigint 组件
   //npm install json-bigint --save
   const JSONbigToString = JSONbig({ storeAsString: true })
   
   ApiService.vueInstance.axios.defaults.transformResponse = [function (data) {
     return JSONbigToString.parse(data)
   }];
   ```

   

1. 

