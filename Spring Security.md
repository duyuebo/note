# Spring Security

## 一 概念

credentials:证件信息(例如:用户名/密码)



安全防护包含两个基本方面:

* 登录到系统(认证)
* 访问系统资源时,对认证信息判断的过滤器
  * 需要将认证信息保存到上下文中,供系统其他地方使用.

## 二 主要结构

### 基本内容

1. DelegatingFilterProxy(委托过滤器代理)

   * bridging between the Servlet container’s lifecycle and Spring’s `ApplicationContext`.The Servlet container allows registering `Filter`s using its own standards, but it is not aware of Spring defined Beans. `DelegatingFilterProxy` can be registered via standard Servlet container mechanisms, but delegate all the work to a Spring Bean that implements `Filter`.`DelegatingFilterProxy` looks up *Bean Filter0* from the `ApplicationContext` and then invokes *Bean Filter*
   * Another benefit of `DelegatingFilterProxy` is that it allows delaying looking `Filter` bean instances

2. FilterChainProxy(过滤器链代理)

   Spring Security’s Servlet support is contained within `FilterChainProxy`. `FilterChainProxy` is a special `Filter` provided by Spring Security that allows delegating to many `Filter` instances through `SecurityFilterChain`. Since `FilterChainProxy` is a Bean, it is typically wrapped in a `DelegatingFilterProxy`.

3. SecurityFilterChain(安全过滤器链)

   `SecurityFilterChain`is used by `FilterChainProxy` to determine which Spring Security `Filter`s should be invoked for this request.

   ```java
   public interface SecurityFilterChain {
       boolean matches(HttpServletRequest var1);
   
       List<Filter> getFilters();
   }
   ```

   

4. `ExceptionTranslationFilter`

5. SecurityContextHolder

6. SecurityContext

7. Authentication

8. GrantedAuthority

9. AuthenticationManager

   ```java
   public interface AuthenticationManager {
     Authentication authenticate(Authentication authentication)
       throws AuthenticationException;
   }
   ```

10. ProviderManager

    AuthenticationManager最常用的实现是`ProviderManager`，它委派了AuthenticationProvider实例链

11. AuthenticationProvider

    ```java
    public interface AuthenticationProvider {
    	Authentication authenticate(Authentication authentication)
    			throws AuthenticationException;
    	boolean supports(Class<?> authentication);
    }
    ```

    ![](Spring Security.assets/Screenshot-2022-01-25-at-20.35.14.png)

    ![img](Spring Security.assets/series-2-2-min.jpg)

    ![img](Spring Security.assets/5.-Scenario-3.1---Custom-Filter-and-UserDetailsService-1.png)

    

12. `AuthenticationEntryPoint`

13. AbstractAuthenticationProcessingFilter

14. spring security 过滤器

    * ChannelProcessingFilter
    * WebAsyncManagerIntegrationFilter
    * SecurityContextPersistenceFilter
    * HeaderWriterFilter
    * CorsFilter
    * CsrfFilter
    * LogoutFilter
    * OAuth2AuthorizationRequestRedirectFilter
    * Saml2WebSsoAuthenticationRequestFilter
    * X509AuthenticationFilter
    * AbstractPreAuthenticatedProcessingFilter
    * CasAuthenticationFilter
    * OAuth2LoginAuthenticationFilter
    * Saml2WebSsoAuthenticationFilter
    * [`UsernamePasswordAuthenticationFilter`](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html#servlet-authentication-usernamepasswordauthenticationfilter)
    * OpenIDAuthenticationFilter
    * DefaultLoginPageGeneratingFilter
    * DefaultLogoutPageGeneratingFilter
    * ConcurrentSessionFilter
    * [`DigestAuthenticationFilter`](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/digest.html#servlet-authentication-digest)
    * BearerTokenAuthenticationFilter
    * [`BasicAuthenticationFilter`](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/basic.html#servlet-authentication-basic)
    * RequestCacheAwareFilter
    * SecurityContextHolderAwareRequestFilter
    * JaasApiIntegrationFilter
    * RememberMeAuthenticationFilter
    * AnonymousAuthenticationFilter
    * OAuth2AuthorizationCodeGrantFilter
    * SessionManagementFilter
    * [`ExceptionTranslationFilter`](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-exceptiontranslationfilter)
    * [`FilterSecurityInterceptor`](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-requests.html#servlet-authorization-filtersecurityinterceptor)
    * SwitchUserFilter

15. 配置spring security `WebSecurityConfigurerAdapter`

    ```java
    @Configuration
    public class ApplicationSecurity extends WebSecurityConfigurerAdapter
    ```

16. 

### 总结

1. 一般将自己的认证过滤器加在 `UsernamePasswordAuthenticationFilter` 的前面,因为这是认证的起点.
2. 



## 三 我需要的安全处理内容

 ### 基本需求

1. 实现登录返回token给客户端用
2. 实现登录的过程需要从数据库进行用户判断
3. 登录成功将用户的权限信息,和用户信息保存到上下文中,以便在其他地方可以使用(例如controller中)
4. 用户未登录访问受保护地址时,提示401错误
5. 用户访问不属于自己权限的方法时提示403错误

### 其他需求

1. 

## 四 问题

1. spring security添加自定义过滤器时,是否对原先的过滤器链有影响?

2. 如何处理带验证码的登录流程?

3. 什么时候需要重写userService方法?

4. 什么情况下需要重写AuthenticationProvider?

5. 默认的AuthenticationManager,AuthenticationProvider,UserService 如何配置进spring security?

6. 为什么`ExceptionTranslationFilter`在过滤器链靠后的位置却可以处理前面过滤器抛出的AuthenticationException?

   ```java
   // 按照一般的理解不应该是 ExceptionTranslationFilter里的doFilter先放行过滤器执行然后包裹住后面执行出现的异常不是吗?可是这样就要求 ExceptionTranslationFilter 出现在过滤器的前面,回到问题?
    @Override
   public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
       try {
           filterChain.doFilter(request, response);
       } catch (RuntimeException e) {
   
           // custom error response class used across my project
           ErrorResponse errorResponse = new ErrorResponse(e);
   
           response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
           response.getWriter().write(convertObjectToJson(errorResponse));
       }
   ```

7. 什么时候需要使用 `successfulAuthentication`方法,而不是在认证方法中执行完全部操作?

   认证方法只是执行认证,并不关心结果,使用的责任链模式,只是父类执行认证过程的一环,父类交由子类进行认证,认证失败会抛出异常,认证成功后由父类调用`successfulAuthentication`方法.

8. 

## 五 安全框架配置依据

1. 首先确认登录信息如何提交.依据不同的提交方式由不同的filter进行处理.

   例如:是否是表单提交?还是restful提交?还是basic auth提交?

2. 

## 六 使用场景及处理方式

1. 确定系统登录方式.ajax提交还是,表单post提交.
2. 确定系统登录结果处理方式,获取响应json 还是 跳转页面.
3. 

