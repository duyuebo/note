# Spring Security

## 一 概念

credentials:证件信息(例如:用户名/密码)

安全防护包含两个基本方面:

![Authentication vs Authorization](https://howtodoinjava.com/wp-content/uploads/2023/05/Authentication-vs-Authorization.svg)

* 登录到系统(认证)
* 访问系统资源时,对认证信息判断的过滤器
  * 需要将认证信息保存到上下文中,供系统其他地方使用.

## 二 主要结构

### 基本内容

1. ApplicationFilterChain

   ![image-20231125101815028](https://s2.loli.net/2023/11/25/wYiUSnf16FLEgD9.png)

   ![](https://s2.loli.net/2023/11/25/GkxPflhqNXWi5bR.png)

   

   ![image-20231124103054442](https://s2.loli.net/2023/11/24/6l7fDmTYwMyn8FO.png)

   * **springSecurityFilterChain** 这个bean什么时候注册到容器中的？

     springSecurityFilterChain是先通过spring的autoconfiguration注入spring容器中，然后被DelegatingFilterProxyRegistrationBean注入到[servlet](https://so.csdn.net/so/search?q=servlet&spm=1001.2101.3001.7020)容器中。

     @EnableWebSecurity 这个bean导入了**WebSecurityConfiguration**，WebSecurityConfiguration里定义了Bean **springSecurityFilterChain**

     ![image-20231124150634625](https://s2.loli.net/2023/11/24/TFLzldtGikUoYm9.png)

     ![image-20231124150828699](https://s2.loli.net/2023/11/24/Z5THFkw68IpVQCD.png)

   * 为什么不是**DelegatingFilterProxy** 类型而是 **DelegatingFilterProxyRegistrationBean** 这个类型？

     ```java
     // springSecurityFilterChain 这个bean什么时候注册到容器中的？ 
     @Bean
     @ConditionalOnBean(name = "springSecurityFilterChain")    // 容器中有名为 springSecurityFilterChain 的 Bean 时满足条件 
     public DelegatingFilterProxyRegistrationBean securityFilterChainRegistration(
         SecurityProperties securityProperties) {
         DelegatingFilterProxyRegistrationBean registration = new DelegatingFilterProxyRegistrationBean(
                 "springSecurityFilterChain");
         registration.setOrder(securityProperties.getFilter().getOrder());
         registration.setDispatcherTypes(getDispatcherTypes(securityProperties));
         return registration;
     }
     
     ```

     **DelegatingFilterProxyRegistrationBean** 会在容器启动的时候向容器中注册 **DelegatingFilterProxy**这个bean。

   * 继承层次 ServletContextInitializer (是 Spring 自己的实现，在 Spring 容器启动时会被调用)

     ![image-20231124104606146](https://s2.loli.net/2023/11/24/KkNYqVGaT4MniEe.png)

   * **@EnableWebSecurity** 为什么没有加这个注解感觉Spring Security也能生效？

     配置文件 org.springframework.boot.autoconfigure.AutoConfiguration.imports 中加载了

     ![image-20231125092354076](https://s2.loli.net/2023/11/25/nHaFEBKhPOqyDNb.png)

     **SecurityAutoConfiguration** 引入了`@Import({ SpringBootWebSecurityConfiguration.class, SecurityDataConfiguration.class })`

     在**SpringBootWebSecurityConfiguration**中自动配置了这个注解。

     ![image-20231125091535624](https://s2.loli.net/2023/11/25/nYe76ObXc3qzP1f.png)

   * 

2. **DelegatingFilterProxy**(委托过滤器代理)

   * bridging between the Servlet container’s lifecycle and Spring’s `ApplicationContext`.The Servlet container allows registering `Filter`s using its own standards, but it is not aware of Spring defined Beans. `DelegatingFilterProxy` can be registered via standard Servlet container mechanisms, but delegate all the work to a Spring Bean that implements `Filter`.`DelegatingFilterProxy` looks up *Bean Filter0* from the `ApplicationContext` and then invokes *Bean Filter*

   * Another benefit of `DelegatingFilterProxy` is that it allows delaying looking `Filter` bean instances

   * a `Filter` implementation

   * In a Spring Boot application, *[**SecurityFilterAutoConfiguration**](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/security/servlet/SecurityFilterAutoConfiguration.html)* automatically registers the *DelegatingFilterProxy* filter with the name *springSecurityFilterChain*.

   * Once the request reaches to *DelegatingFilterProxy*, Spring delegates the processing to *FilterChainProxy* bean that utilizes the *[SecurityFilterChain](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/web/SecurityFilterChain.html)* to execute the list of all filters to be invoked for the current request.

     ![img](https://howtodoinjava.com/wp-content/uploads/2023/05/Spring-Security-Architechture.svg)

     You can see that this hypothetical picture above has the `FilterChainProxy` as a second filter in the **Filter Chain** (the dashed box). Once the `FilterChainProxy` is done processing its `SecurityFilterChain` filters, it will call the `originalChain` (dashed box) to resume the processing of the remaining filters, in the above scenario, Filter2.

   * Once the request reaches registered filters inside the *SecurityFilterChain*, the corresponding filters delegate the request to other beans for performing corresponding tasks. For example, *AuthenticationProcessingFilter* prepares the *Authentication* instance and delegates it to *AuthenticationManager* for [authentication flow](https://howtodoinjava.com/spring-security/custom-authentication-providers/).

   * DelegatingFilterProxy. It delegates request processing to a filter registered in the application context, and in the case of Spring Security, this filter will be the FilterChainProxy. The FilterChainProxy is responsible for processing requests through the security filter chain known as SecurityFilterChain。

   * ![image-20231117175135813](https://s2.loli.net/2023/11/17/RQxrhINfLtAbzYF.png)![image-20231117175158632](https://s2.loli.net/2023/11/17/2w7KgRV3UXDhs5r.png)

3. **FilterChainProxy**(过滤器链代理)

   Spring Security’s Servlet support is contained within `FilterChainProxy`. `FilterChainProxy` is a special `Filter` provided by Spring Security that allows delegating to many `Filter` instances through `SecurityFilterChain`. Since `FilterChainProxy` is a Bean, it is typically wrapped in a `DelegatingFilterProxy`.

4. **SecurityFilterChain**(安全过滤器链)

   `SecurityFilterChain`is used by `FilterChainProxy` to determine which Spring Security `Filter`s should be invoked for this request.

   The [Security Filters](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-security-filters) in `SecurityFilterChain` are typically Beans, but they are registered with `FilterChainProxy` instead of [DelegatingFilterProxy](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-delegatingfilterproxy). `FilterChainProxy` provides a number of advantages to registering directly with the Servlet container or [DelegatingFilterProxy](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-delegatingfilterproxy). 

   * First, it provides **a starting point for all of Spring Security’s Servlet support**. For that reason, if you try to troubleshoot Spring Security’s Servlet support, adding a debug point in `FilterChainProxy` is a great place to start.

   * **Second, since `FilterChainProxy` is central to Spring Security usage, it can perform tasks that are not viewed as optional**. For example, it clears out the `SecurityContext` to avoid memory leaks. It also applies Spring Security’s [`HttpFirewall`](https://docs.spring.io/spring-security/reference/servlet/exploits/firewall.html#servlet-httpfirewall) to protect applications against certain types of attacks.

   * In addition, it provides more flexibility in determining when a `SecurityFilterChain` should be invoked. In a Servlet container, `Filter` instances are invoked based upon the URL alone. However, `FilterChainProxy` can determine invocation based upon anything in the `HttpServletRequest` by using the `RequestMatcher` interface.

   * uses the `matches(HttpServletRequest request)` method to determine which filters should process a specific HttpServletRequest

   ```java
   public interface SecurityFilterChain {
       boolean matches(HttpServletRequest var1);
   
       List<Filter> getFilters();
   }
   ```

5. **ExceptionTranslationFilter**

   ![exceptiontranslationfilter](https://s2.loli.net/2023/11/08/cCJ3HPwzFXLflBe.png)

6. **SecurityContextHolder**

   At the heart of Spring Security’s authentication model is the `SecurityContextHolder`. It contains the [SecurityContext](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontext).

   ![securitycontextholder](https://s2.loli.net/2023/11/08/L6ogGXCxHzFqhfj.png)

7. **SecurityContext**

8. **Authentication**

9. **GrantedAuthority**

10. **AuthenticationManager**

   ```java
   public interface AuthenticationManager {
     Authentication authenticate(Authentication authentication)
       throws AuthenticationException;
   }
   ```

11. **ProviderManager**

    AuthenticationManager最常用的实现是`ProviderManager`，它委派了AuthenticationProvider实例链

    ![供应商经理](https://s2.loli.net/2023/11/08/cWDq6VBpvraQtiP.png)

12. **AuthenticationProvider**

    ```java
    public interface AuthenticationProvider {
    	Authentication authenticate(Authentication authentication)
    			throws AuthenticationException;
    	boolean supports(Class<?> authentication);
    }
    ```

    ![](https://s2.loli.net/2023/04/22/UFuksgmwDZTRht1.png)

    ![img](https://s2.loli.net/2023/04/22/tGX6MY2QKOcmCkd.jpg)

    ![img](https://s2.loli.net/2023/04/22/3bosGOA1JdftyH4.png)

    

13. **AuthenticationEntryPoint**

    [`AuthenticationEntryPoint`](https://docs.spring.io/spring-security/site/docs/6.1.5/api/org/springframework/security/web/AuthenticationEntryPoint.html) is used to send an HTTP response that requests credentials from a client.

14. **AbstractAuthenticationProcessingFilter**

    [`AbstractAuthenticationProcessingFilter`](https://docs.spring.io/spring-security/site/docs/6.1.5/api/org/springframework/security/web/authentication/AbstractAuthenticationProcessingFilter.html) is used as a base `Filter` for authenticating a user’s credentials. Before the credentials can be 

    

    

    

    authenticated, Spring Security typically requests the credentials by using [`AuthenticationEntryPoint`](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationentrypoint).

    ![abstractauthenticationprocessingfilter](https://s2.loli.net/2023/11/08/6DoWjUlYQxzrITP.png)

    ![number 1](https://s2.loli.net/2023/11/08/8YhQfdsbw1oWtz5.png) When the user submits their credentials, the `AbstractAuthenticationProcessingFilter` creates an [`Authentication`](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authentication) from the `HttpServletRequest` to be authenticated. The type of `Authentication` created depends on the subclass of `AbstractAuthenticationProcessingFilter`. For example, [`UsernamePasswordAuthenticationFilter`](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html#servlet-authentication-usernamepasswordauthenticationfilter) creates a `UsernamePasswordAuthenticationToken` from a *username* and *password* that are submitted in the `HttpServletRequest`.

    ![number 2](https://s2.loli.net/2023/11/08/YwRsLg89fGurPNc.png) Next, the [`Authentication`](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authentication) is passed into the [`AuthenticationManager`](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationmanager) to be authenticated.

    ![number 3](https://s2.loli.net/2023/11/08/PruUzHgDfplM2Y7.png) If authentication fails, then *Failure*.

    - The [SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder) is cleared out.
    - `RememberMeServices.loginFail` is invoked. If remember me is not configured, this is a no-op. See the [`rememberme`](https://docs.spring.io/spring-security/site/docs/6.1.5/api/org/springframework/security/web/authentication/rememberme/package-frame.html) package.
    - `AuthenticationFailureHandler` is invoked. See the [`AuthenticationFailureHandler`](https://docs.spring.io/spring-security/site/docs/6.1.5/api/org/springframework/security/web/authentication/AuthenticationFailureHandler.html) interface.

    ![number 4](https://s2.loli.net/2023/11/08/yXCwIBOQhZ6MSGL.png) If authentication is successful, then *Success*.

    - `SessionAuthenticationStrategy` is notified of a new login. See the [`SessionAuthenticationStrategy`](https://docs.spring.io/spring-security/site/docs/6.1.5/api/org/springframework/security/web/authentication/session/SessionAuthenticationStrategy.html) interface.
    - The [Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authentication) is set on the [SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder). Later, if you need to save the `SecurityContext` so that it can be automatically set on future requests, **`SecurityContextRepository#saveContext` must be explicitly invoked**. See the [`SecurityContextHolderFilter`](https://docs.spring.io/spring-security/site/docs/6.1.5/api/org/springframework/security/web/context/SecurityContextHolderFilter.html) class.
    - `RememberMeServices.loginSuccess` is invoked. If remember me is not configured, this is a no-op. See the [`rememberme`](https://docs.spring.io/spring-security/site/docs/6.1.5/api/org/springframework/security/web/authentication/rememberme/package-frame.html) package.
    - `ApplicationEventPublisher` publishes an `InteractiveAuthenticationSuccessEvent`.
    - `AuthenticationSuccessHandler` is invoked. See the [`AuthenticationSuccessHandler`](https://docs.spring.io/spring-security/site/docs/6.1.5/api/org/springframework/security/web/authentication/AuthenticationSuccessHandler.html) interface.

15. spring security 过滤器

    ![](https://s2.loli.net/2023/04/22/ZWMIG4hgtCRNVQO.png)

    * 过滤器链已经更新为（spring-boot-starter-security3.0.5版本）：

      ```java
      org.springframework.security.web.session.DisableEncodeUrlFilter
      org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter
      org.springframework.security.web.context.SecurityContextHolderFilte
      org.springframework.security.web.header.HeaderWriterFilter
      org.springframework.security.web.csrf.CsrfFilter
      org.springframework.security.web.authentication.logout.LogoutFilter
      org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
      org.springframework.security.web.authentication.ui.DefaultLoginPageGeneratingFilter
      org.springframework.security.web.authentication.ui.DefaultLogoutPageGeneratingFilter
      org.springframework.security.web.authentication.www.BasicAuthenticationFilter
      org.springframework.security.web.savedrequest.RequestCacheAwareFilter
      org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter
      org.springframework.security.web.authentication.AnonymousAuthenticationFilter
      org.springframework.security.web.access.ExceptionTranslationFilter
      org.springframework.security.web.access.intercept.AuthorizationFilter
      ```

      

    * ChannelProcessingFilter

    * WebAsyncManagerIntegrationFilter

    * SecurityContextPersistenceFilter

      * SecurityContextPersistenceFilter 是用来在认证之前从SecurityContextRepository获取SecurityContext，然后放入SecurityContextHolder中。

      * 然后在其他filter执行完毕之后，再将SecurityContext 通过SecurityContextRepository存储到想要存储的地方，然后清理掉SecurityContextHolder中的SecurityContext

    * HeaderWriterFilter

      * response写安全响应头信息的

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

      * The [`ExceptionTranslationFilter`](https://docs.spring.io/spring-security/site/docs/6.2.0/api/org/springframework/security/web/access/ExceptionTranslationFilter.html) allows translation of [`AccessDeniedException`](https://docs.spring.io/spring-security/site/docs/6.2.0/api/org/springframework/security/access/AccessDeniedException.html) and [`AuthenticationException`](https://docs.spring.io/spring-security/site/docs/6.2.0/api//org/springframework/security/core/AuthenticationException.html) into HTTP responses。
      * 

    * [`FilterSecurityInterceptor`](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-requests.html#servlet-authorization-filtersecurityinterceptor)

    * SwitchUserFilter

16. 配置spring security `WebSecurityConfigurerAdapter`

    ```java
    @Configuration
    public class ApplicationSecurity extends WebSecurityConfigurerAdapter
    ```

17. 认证过滤器中authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request))的作用

    ```java
    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    /**
    It has a single responsibility to convert an instance of HttpServletRequest class into an instance of the WebAuthenticationDetails class. You can think of it as a simple converter.
    
    HttpServletRequest object which represents the parsed raw HTTP data and is a standard Java class is the input. And the WebAuthenticationDetails is an internal Spring class.
    
    Therefore, you can think of it as a bridge between servlet classes and Spring classes.
    
    The HttpServletRequest is an ancient class. Goes all the way back to Java 6. (link). And the other one comes from Spring. (link)
    */
    ```

    

18. 

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

   这里的 doFilter 方法中过滤器链继续向下执行，ExceptionTranslationFilter 处于 Spring Security 过滤器链的倒数第二个，最后一个是 FilterSecurityInterceptor，FilterSecurityInterceptor 专门处理授权问题，在处理授权问题时，就会发现用户未登录、未授权等，进而抛出异常，抛出的异常，最终会被 ExceptionTranslationFilter#doFilter 方法捕获。

   用户登录过程为什么先执行FilterSecurityInterceptor，这个过滤器不是在ExceptionTranslationFilter后面？![登录URL验证入口点](https://s2.loli.net/2023/11/08/KzXPyfIvtYromQD.png)

7. 什么时候需要使用 `successfulAuthentication`方法,而不是在认证方法中执行完全部操作?

   认证方法只是执行认证,并不关心结果,使用的责任链模式,只是父类执行认证过程的一环,父类交由子类进行认证,认证失败会抛出异常,认证成功后由父类调用`successfulAuthentication`方法.

8.  DelegatingFilterProxy(委托过滤器代理)、FilterChainProxy(过滤器链代理)、SecurityFilterChain(安全过滤器链) 之间的相互关系，以及如何和AuthenticationManager、AuthenticationProvider等组件进行交互

   ![(https://s2.loli.net/2023/11/08/x2njaqls39fTKIU.png)![multi securityfilterchain](https://s2.loli.net/2023/11/08/AqPX6jTHEpJ9K8Y.png)

9. 

## 五 安全框架配置依据

1. 首先确认登录信息如何提交.依据不同的提交方式由不同的filter进行处理.

   例如:是否是表单提交?还是restful提交?还是basic auth提交?

2. 

## 六 使用场景及处理方式

1. 确定系统登录方式.ajax提交还是,表单post提交.
2. 确定系统登录结果处理方式,获取响应json 还是 跳转页面.
3. 

## 七 场景分类

1. 系统可以访问用户的密码信息。

   * 定义UserDetailsService

     实现 UserDetailsService接口

   * 定义PasswordEncoder

2. 系统不知道用户的密码信息，自定义**AuthenticationProvider** 

   * 

## 八 JWT认证的优缺点

## 九 其他问题

1. 配置跨域过滤器。没解决！！！

   ```java
   	//官方配置示例
   	@Bean
   	public CorsConfigurationSource corsConfigurationSource() {
   		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
   		CorsConfiguration config = new CorsConfiguration();
   		config.addAllowedHeader("*");
   		config.addAllowedMethod("*");
   		config.addAllowedOrigin("http://127.0.0.1:4200");
   		config.setAllowCredentials(true);
   		source.registerCorsConfiguration("/**", config);
   		return source;
   	}
   
   ```

   

   chrome://flags/#block-insecure-private-network-requests 设置disabled

   ```java
       @Bean
       CorsConfigurationSource corsConfigurationSource() {
           System.out.println("配置跨域过滤器------");
           CorsConfiguration config = new CorsConfiguration();
           config.addAllowedOrigin("*");
           config.setAllowCredentials(true);
           config.addAllowedHeader("*");
           config.addAllowedMethod("*");
   
           UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
           source.registerCorsConfiguration("/**", config);
           return source;
       }
   
       @Bean
       SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
           http
                   .httpBasic().disable()
                   .csrf().disable()
                   .cors(withDefaults())
                   .authorizeHttpRequests(auth -> auth
                           // 允许所有OPTIONS请求
                           .requestMatchers(HttpMethod.OPTIONS).permitAll()
                           // 允许直接访问授权登录接口
                           .requestMatchers(HttpMethod.POST,"/login").permitAll()
                           .requestMatchers(URL_WHITELIST).permitAll()
                           // 允许 SpringMVC 的默认错误地址匿名访问
                           .requestMatchers("/error").permitAll()
                           // 其他所有接口必须有Authority信息，Authority在登录成功后的UserDetailsImpl对象中默认设置“ROLE_USER”
                           //.requestMatchers("/**").hasAnyAuthority("ROLE_USER")
                           // 允许任意请求被已登录用户访问，不检查Authority
                           .anyRequest().authenticated())
                   .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                   .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
           return http.build();
       }
   ```

2. 不太清楚的组件 `SecurityContextRepository`，`SecurityContextHolderStrategy`，`SecurityContextHolder`

3. `ForceEagerSessionCreationFilter`感觉这个组件怎么没有加到`springSecurityFilterChain`中？

4. 默认的用户登录认证是`UsernamePasswordAuthenticationFilter`,默认的请求过滤器是什么，哪一个过滤器进行session信息存储到SecurityContext中？

5. 授权过滤器如何判断用户是否登录？

   * 从上下文中取出Authentication对象，通过判断这个对象是否已通过认证来确定用户是否登录。

   * ```java
     // AuthorizationFilter 通过授权过滤器 
     AuthorizationDecision decision = this.authorizationManager.check(this::getAuthentication, request);
     // authorizationManager 对象为: RequestMatcherDelegatingAuthorizationManager
     // AuthenticatedAuthorizationManager
     ```

   * ![image-20231202153742410](https://s2.loli.net/2023/12/02/Ro7xfDCI8iqtZmb.png)

   * ![image-20231202154356360](https://s2.loli.net/2023/12/02/OcM8o5mTzEjiwDZ.png)

   * ![image-20231202154516687](https://s2.loli.net/2023/12/02/YSglo1c3jk6TRPL.png)

   * ![image-20231202154552517](https://s2.loli.net/2023/12/02/FbpC7EUlXIHhLMg.png)

6. 认证成功之后如何将用户登录信息保存下来。

   * 登录后执行:

     ![image-20231202172736886](https://s2.loli.net/2023/12/02/YzroudW5e4nUc12.png)

   * 保存上下文信息到Repository中，方便下次访问的时候获取信息：

     ![image-20231202172840134](https://s2.loli.net/2023/12/02/CBEfFG65iumLeUa.png)

   * 

7. 

## 十 登录认证流程

### 以表单登录为例:

1. 当用户没有登录访问受保护资源时：

   * 此URL被保护所以会经过spring security filter，当经过前面所有的spring security filter 到达(FilterSecurtiyInterceptor)时，发现还没有完成认证，此处会抛出AccessDeniedException

     ![image-20231108214309770](https://s2.loli.net/2023/11/08/YDsTgH9wSVyjGIE.png)

   * 上面代码中的获取this::getAuthentication部分当获取不到认证信息的时候会抛出异常

     ![image-20231108214535166](https://s2.loli.net/2023/11/08/3QfORzq6DaGvsFP.png)

   * 没有抛出AuthenticationCredentialsNotFoundException是因为，默认spring security构造了一个匿名用户：

     在哪个过滤器类中构造了一个匿名用户？
     
     ![image-20231108215255423](https://s2.loli.net/2023/11/08/J2wmOaKqj7IMrk6.png)

   ![登录URL验证入口点](https://s2.loli.net/2023/11/08/E4kFT5LiGjuJnv1.png)

2. 用户在登录页面输入用户名、密码等信息。

3. 登录的默认处理URL是：/login。

   ![usernamepasswordauthenticationfilter](https://s2.loli.net/2023/11/09/NoGSBtPpgYALvQ3.png)

4. UsernamePasswordAuthenticationFilter 配置的拦截URL为 /login。所以此filter进行拦截处理。

   * UsernamePasswordAuthenticationFilter 继承自 AbstractAuthenticationProcessingFilter，由于 UsernamePasswordAuthenticationFilter 没有重写doFilter代码。所以此过滤器默认调用 AbstractAuthenticationProcessingFilter 的doFilter方法，AbstractAuthenticationProcessingFilter doFilter方法如下：

     ![image-20231108211631679](https://s2.loli.net/2023/11/08/I5LNRu2te7D6Sdw.png)

   * 在子类UsernamePasswordAuthenticationFilter 中，首先提取username、password然后构造UsernamePasswordAuthenticationToken对象，然后再调用系统中的AuthenticationManager对象的authenticate方法进行认证。

     ![image-20231108211808364](https://s2.loli.net/2023/11/08/heXvopwSV9NfKHg.png)

   * 登录失败的逻辑不会再走ExceptionTranslationFilter

5. 213

## 十一 授权：

1. AuthorizationManager 
