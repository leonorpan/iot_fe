# WS RF Test

## 🚀 Quick Start

To get started:

```bash
npm install
npm run dev
```

This installs all dependencies and starts the development environment.

## Questions

### What aspect of this exercise did you find most interesting?

What I enjoyed most was the **freedom to make my own decisions**. The **functional requirements were clearly defined**, but I appreciated the **flexibility to design my own UI** and **choose the tools** I felt were best suited for the task. I opted for **Tailwind CSS** because it offers **utility-first styling out of the box**, which helps build clean, responsive components quickly without getting bogged down in custom CSS. It felt like the right choice for a **small, focused task** like this.

One highlight was **implementing the WebSocket connection**. It’s not something I work with every day, so **revisiting the WebSocket API was refreshing**. It also gave me the chance to think more deliberately about **connection handling and error resilience** — especially since **error management in this context is a bit different** from typical REST-based interactions.

Since the **task scope was relatively small**, I also took the chance to **set up a few things I highly recommend** but weren't part of the requirements — like configuring **pre-commit hooks** to catch **TypeScript errors early**, setting up a **proper monorepo structure**, and **writing tests**. It helped make the project feel more like a **real production setup**, which I found satisfying.

### What did you find most cumbersome to do?

Nothing stood out as particularly cumbersome. I ran into a few **small hiccups with the initial project setup**, but that’s usually expected when **bootstrapping a new project**. I chose **Vite** to **simplify and speed up the development workflow**, and overall that decision **paid off well**!

### How can we further improve the user experience?

At this stage, the **UI is functional and handles errors gracefully**, but there’s room for polish. With some additional **design attention**, the interface could be more **visually refined** — but for the scope of the task, the current experience is **solid**.

From an architectural perspective, I’ve used **component-level state** to manage the WebSocket connection and related logic, which is appropriate for a **single-view app**. However, if this application were to grow — for instance, if the WebSocket needed to be shared across multiple pages or features — I would **abstract the WebSocket connection into a standalone module or service**. This would allow better control over **connection lifecycle, message handling, and error management**, and make it easier to integrate with a more **centralized state management solution** for **scalability and maintainability**.
