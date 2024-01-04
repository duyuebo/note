# Spring Authorization Server

>
>
>Spring Authorization Server 是一个框架，它提供了 OAuth 2.1 和 OpenID Connect 1.0 规范以及其他相关规范的实现。

## 基本概念：

* [OpenID Connect](https://hennge.com/tw/blog/what-is-openid-connect.html) 
  * OpenID Connect 是 OpenID Foundation 在 2014 年發布的 [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) 中定義的一個身分認證協議。是以當時就已被廣為使用的 OAuth 2.0 的協議為基礎，再加上可以認證使用者的層次而成。
  * OAuth 2.0 只是一個定義如何使用 Access Token 來授權的協議，內容是沒有提到如何去認證一個使用者的登入

## 认证架构：

* ![Oauth grant flow choice](https://res.cloudinary.com/practicaldev/image/fetch/s--WQ9tBjlI--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m8reo62cmv0vnuhddz5v.png)

* BFF：

  BFF is considered safer not because of the cookie usage when using the access tokens but because the way of obtaining tokens is more secure. SPAs by definition are not able to keep a secret (in the browser) thus have to use a flow that involves a public client. The BFF allows for a confidential client because the client secret is kept in the backend.

  Using PKCE with the public client gives you assurance indeed about the same entity requesting and receiving the tokens, but it give you little assurance about the authenticity of that client. A confidential client takes care of the latter.

* 

## 核心组件：

* **RegisteredClient**

* **RegisteredClientRepository**

  * The RegisteredClientRepository is a REQUIRED component。

* **OAuth2Authorization**

  * An OAuth2Authorization is a representation of an OAuth2 authorization, which holds state related to the authorization granted to a client, by the resource owner or itself in the case of the client_credentials authorization grant type。

  * ```java
    public class OAuth2Authorization implements Serializable {
    	private String id;  
    	private String registeredClientId;  
    	private String principalName;   
    	private AuthorizationGrantType authorizationGrantType;  
    	private Set<String> authorizedScopes;   
    	private Map<Class<? extends OAuth2Token>, Token<?>> tokens; 
    	private Map<String, Object> attributes; 
    
    	...
    
    }
    ```

  * 

* **OAuth2AuthorizationService**
  
  * The `OAuth2AuthorizationService` is the central component where new authorizations are stored and existing authorizations are queried。
  * The OAuth2AuthorizationService is an OPTIONAL component and defaults to InMemoryOAuth2AuthorizationService.
  
* **OAuth2AuthorizationConsent**

* **OAuth2AuthorizationConsentService**

* The `OAuth2AuthorizationConsentService` is an **OPTIONAL** component and defaults to `InMemoryOAuth2AuthorizationConsentService`.

* **OAuth2TokenContext**

  * An `OAuth2TokenContext` is a context object that holds information associated with an `OAuth2Token` and is used by an [OAuth2TokenGenerator](https://docs.spring.io/spring-authorization-server/docs/current/reference/html/core-model-components.html#oauth2-token-generator) and [OAuth2TokenCustomizer](https://docs.spring.io/spring-authorization-server/docs/current/reference/html/core-model-components.html#oauth2-token-customizer).

  * ```java
    public interface OAuth2TokenContext extends Context {
    
    	default RegisteredClient getRegisteredClient() ...  (1)
    
    	default <T extends Authentication> T getPrincipal() ... (2)
    
    	default AuthorizationServerContext getAuthorizationServerContext() ...    (3)
    
    	@Nullable
    	default OAuth2Authorization getAuthorization() ...  (4)
    
    	default Set<String> getAuthorizedScopes() ...   (5)
    
    	default OAuth2TokenType getTokenType() ...  (6)
    
    	default AuthorizationGrantType getAuthorizationGrantType() ...  (7)
    
    	default <T extends Authentication> T getAuthorizationGrant() ...    (8)
    
    	...
    
    }
    ```

* **OAuth2TokenGenerator**

  * An `OAuth2TokenGenerator` is responsible for generating an `OAuth2Token` from the information contained in the provided [OAuth2TokenContext](https://docs.spring.io/spring-authorization-server/docs/current/reference/html/core-model-components.html#oauth2-token-context).
  * The `OAuth2TokenGenerator` is an **OPTIONAL** component and defaults to a `DelegatingOAuth2TokenGenerator` composed of an `OAuth2AccessTokenGenerator` and `OAuth2RefreshTokenGenerator`.
  * If a `JwtEncoder` `@Bean` or `JWKSource<SecurityContext>` `@Bean` is registered, then a `JwtGenerator` is additionally composed in the `DelegatingOAuth2TokenGenerator`.

* **OAuth2TokenCustomizer**

  * An OAuth2TokenCustomizer provides the ability to customize the attributes of an OAuth2Token, which are accessible in the provided OAuth2TokenContext. It is used by an OAuth2TokenGenerator to let it customize the attributes of the OAuth2Token before it is generated.

* **SessionRegistry**

  * If OpenID Connect 1.0 is enabled, a `SessionRegistry` instance is used to track authenticated sessions. The `SessionRegistry` is used by the default implementation of `SessionAuthenticationStrategy` associated to the [OAuth2 Authorization Endpoint](https://docs.spring.io/spring-authorization-server/docs/current/reference/html/protocol-endpoints.html#oauth2-authorization-endpoint) for registering new authenticated sessions.

* **OAuth2AuthorizationServerConfiguration**

* **OAuth2AuthorizationServerConfigurer**

## 认证模式

### 授权码模式：

* 第10步的时候要同时提交客户端的账号密码。

![img](https://s2.51cto.com/images/blog/202310/12151535_65279d178ca1042050.svg)

* 认证服务器过滤器：

![img](https://miro.medium.com/v2/resize:fit:700/1*nh751z5Mn-IRhuID4o0hyg.png)

* AuthenticationProvider：

![img](https://miro.medium.com/v2/resize:fit:700/1*gxzltDhdG0fk4qu3C2LRUw.png)

* 过滤器处理流程：

  * 首先调用获取授权端点：`/oauth2/authorize`,由 **OAuth2AuthorizationEndpointFilter** 过滤器进行处理。

    `/oauth2/authorize?response_type=code&client_id=oidc-client&scope=profile openid&redirect_uri=http://www.baidu.com`

    * 从request中获取认证信息。
    * 调用provider进行认证。

    ![image-20231127154956403](https://s2.loli.net/2023/11/27/7sfqEOtXJiuINFe.png)

  * 

* 

### 自定义认证功能：

* ![img](https://s2.51cto.com/images/blog/202310/10130000_6524da507971b75478.svg)

* Create a converter that can perform an initial check to verify whether the `HttpServletRequest` meets the necessary conditions. If it does, the converter should then transform the request into an `Authentication` object.

  * 什么时候调用converter？

* Create a provider responsible for handling the created `Authentication` and generating an Access Token.

  * clientPrincipal的填充时机？

    ![image-20231113095218480](https://s2.loli.net/2023/11/13/EouzkXt1MIF6TGe.png)

![img](https://miro.medium.com/v2/resize:fit:700/1*SnD0XjxkBY0qRwnQnV2xZw.png)



* client注册响应的授权方式：

  ![image-20231113121931384](https://s2.loli.net/2023/11/13/XsjWmfHDEdBc8M3.png)

* InitializeAuthenticationProviderBeanManagerConfigurer

## 客户端服务器

>
>
>spring-boot-starter-oauth2-client client模块起到的作用。

* `spring-boot-starter-oauth2-client`客户端

  * 自动引入了：

  ![image-20231214092052797](https://s2.loli.net/2023/12/14/eQiWKk9AwFajIqT.png)

  * `OAuth2ClientRegistrationRepositoryConfiguration`引入了`clientRegistrationRepository`组件

  ![image-20231214092226121](https://s2.loli.net/2023/12/14/6LuTwCzjgdWvpsG.png)

  * `OAuth2WebSecurityConfiguration` 引入了 `authorizedClientService`,`authorizedClientRepository`组件

  ![image-20231214094133731](https://s2.loli.net/2023/12/14/fRVsxGBIY216uvL.png)

  * 

* `oauth2Login` 、`oauth2Client`

  * `oauth2Login`会在授权请求时进行**认证**（即设置安全上下文SecurityContext），背后会连续访问acc_token&user-info-url 将获取的用户信息构造填充 Authentication。
  * 而`oauth2Client`也会对授权请求进行处理，但只是获取到access_token后用repository存起来（要怎么使用自行处理），不会认证，这也意味着需要自行实现认证逻辑。

`HttpSessionSecurityContextRepository`

![image-20231213113240042](https://s2.loli.net/2023/12/13/kCse7FcrKtAnTRh.png)

![image-20231213113155931](https://s2.loli.net/2023/12/13/epT4kEWQnJfzKx7.png)

* 处理流程

  * 对授权码code 的请求：由**OAuth2AuthorizationRequestRedirectFilter**响应"授权请求"向客户端返回重定向响应，定向到实际 "authorization-uri"。

  * 对 access_token 和 user-info-uri 实际请求：**OAuth2LoginAuthenticationFilter**会对回调地址(携带了code和state)进行处理，调用AuthenticationManager进行认证。背后OAuth2LoginAuthenticationProvider会进行连续 token-uri、user-info-uri 请求，最后返回完全填充的OAuth2LoginAuthenticationToken。

  * 访问任意地址的时候

    1. 首先**OAuth2AuthorizationRequestRedirectFilter **判断是否是请求授权的请求

       ```java
       OAuth2AuthorizationRequest authorizationRequest = this.authorizationRequestResolver.resolve(request);
       ```

    2. 

* 核心组件

  * **OAuth2AuthorizationRequestRedirectFilter**

  * **OAuth2LoginAuthenticationFilter** 继承自`AbstractAuthenticationProcessingFilter`，即负责身份认证的Filter。

    1. 当是loginProcessingUrl（默认为/login/oauth2/code/*）请求且带了code和state时，尝试以这俩参数构建OAuth2LoginAuthenticationToken且调用AuthenticationManager去进行认证。

    2. 认证通过后，调用authenticationResultConverter将认证后完全填充的OAuth2LoginAuthenticationToken转为authenticated=true的OAuth2AuthenticationToken，用以代表认证后的身份。（该converter默认就是直接提取填充后的"principal、authorities、clientid"直接new）。

    3. 将先前得到 "token、refreshToken" 等信息包装为OAuth2AuthorizedClient调用 OAuth2AuthorizedClientRepository#saveAuthorizedClient保存起来（默认是基于内存实现的ClientId和Principal为key的Map）

  * **OAuth2AuthorizationCodeGrantFilter**（该Filter，在`oauth2Login()`下会永远被跳过，因为该请求已被`OAuth2LoginAuthenticationFilter`处理后通过`successHandler`重定向）

* 过滤器链

  ```
    DisableEncodeUrlFilter
    ForceEagerSessionCreationFilter
    WebAsyncManagerIntegrationFilter
    SecurityContextHolderFilter
    HeaderWriterFilter
    CsrfFilter
    LogoutFilter
  OAuth2AuthorizationRequestRedirectFilter
  OAuth2LoginAuthenticationFilter
    DefaultLoginPageGeneratingFilter
    DefaultLogoutPageGeneratingFilter
    RequestCacheAwareFilter
    SecurityContextHolderAwareRequestFilter
    AnonymousAuthenticationFilter
    SessionManagementFilter
    ExceptionTranslationFilter
    AuthorizationFilter
  ```

* 调试信息：

  1. 

* 

## 资源服务器

>资源服务器的全称是 **OAuth2 Resource Server** ，它实际上是OAuth 2.0 协议的一部分，通常我们借助于Json Web Token来实现。 OAuth2.0授权服务器负责发“证件”，**资源服务器负责对“证件”进行校验**。在去中心化的架构中，每一个API服务本身也承担资源服务器的功能

* 非对称加密采用公钥和私钥进行加密和解密。对于加密操作，公钥负责加密，私钥负责解密。对于签名操作，私钥负责签名，公钥负责验签。

## 问题记录：

* 没加@EnableWebSecurity注解，程序依旧能正常工作？

* **SPA与BFF之间，如何保持登录信息？以及BFF和SSO之间如何保持登录信息**？

* 认证服务器同时作为资源服务器时，需要注意：

  ```java
      @Bean
      public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
           http
  //                .cors(withDefaults())
                  .authorizeHttpRequests(authorize -> authorize.anyRequest().authenticated())
                  .formLogin(Customizer.withDefaults())
                  .logout((logout) -> logout.permitAll());
  //以下代码要放在第二个 SecurityFilterChain 配置中
           http
                  .oauth2ResourceServer(resourceServer -> resourceServer.jwt(Customizer.withDefaults())
                          .accessDeniedHandler(SecurityUtils::exceptionHandler)
                          .authenticationEntryPoint(SecurityUtils::exceptionHandler));
          return http.build();
      }
  ```

* Authentication Server自定义返回token claims时，获取到的 `context.getPrincipal().getPrincipal()`对象是原来的 UserDetails 对象，而不是通过

  UserDetailsService返回的自定义 UserDetails 对象？

* 

## SPA项目中使用SSO问题记录

>

* SPA项目中，后台需要的是资源服务器还是客户端服务器？
* As SPAs can't authenticate themselves, the OAuth server is configured to allow the client application to make token requests without authentication.
* OIDC 中为什么不能把id_token中的数据添加到access_token中？
