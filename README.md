# action-github-test

## I. Khái niệm cơ bản

### 1. Workflow, Jobs, Steps

- Một repository có thể có nhiều workflow.
- Một workflow có nhiều ``job``
- Một ``job`` có nhiều ``step``


- Một workflow có nhiều ``events``, trigger dựa trên events
- Jobs thì định nghĩa ``runner``(thực thi môi trường: linux, macos, windows)
- Step thực thi các ``shell script`` hoặc một ``action``

### 2. Events
  
- Github Actions định nghĩa nhiều ``events``
- Mỗi ``event`` sẽ trigger một workflow
- 