# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - link [ref=e5] [cursor=pointer]:
      - /url: /
      - img [ref=e6]
    - heading "Welcome back" [level=1] [ref=e8]
    - paragraph [ref=e9]: Sign in to your account
  - generic [ref=e10]:
    - generic [ref=e11]:
      - text: Email
      - textbox "you@example.com" [ref=e12]: testuser@example.com
    - generic [ref=e13]:
      - text: Password
      - generic [ref=e14]:
        - textbox "••••••••" [active] [ref=e15]: testpass123
        - button [ref=e16]:
          - img [ref=e17]
    - button "Sign In" [disabled] [ref=e20]
    - paragraph [ref=e21]:
      - text: Don't have an account?
      - link "Sign up" [ref=e22] [cursor=pointer]:
        - /url: /signup
```