/*
  OneText Coding Exercise
  -----------------------

  - Please choose *two* of the following coding exercises to implement
  - Feel free to do them in your own time, or we can pair-code on them on a call, either is completely fine.
  - Asking questions is fine/encouraged! If we're on a call, ask away, otherwise email me with questions at daniel@onetext.com,
    or we can jump on a slack channel.
  - When you're done, let's have a 10-15 minute chat to talk over your solutions
  - We will probably talk over the remaining problems that you didn't implement in our call; but don't feel any obligation to code them out.
    Just want to know you have a high level understanding of how you'd begin to solve them.

  Things we're looking look for:
  
  - Does your solution meet the requirements?
  - How is the code quality? Is it readable/understandable, commented/self-documenting, testable?
  - Are there any corner cases which needed to be covered?

  Bonus (not required, but nice to have if there's time):

  - Did you write a test for your code?
*/



/*
  2. Running tasks with concurrency

  At OneText, we have a lot of third-party api integrations, many of which have rate limits.

  For example, we may need to call a Shopify API ten times to get ten different products.
  But if we actually called Shopify ten times in parallel, we would get rate limited.

  Please write a `runWithConcurrency` function which:

  - Takes an array of asynchronous tasks (functions returning promises)
  - Takes a concurrency limit (e.g. 3)
  - Runs the functions with the expected concurrency (e.g. only 3 tasks should be running at any given time)
  - Return a promise which:
    - Resolves when all of the original tasks are complete, with an array of all results
    - Rejects when any task throws/rejects, with the first error
*/
type ApiResponse = {
  data: string
}

type AsyncTask<ApiResponse> = () => Promise<ApiResponse>;
type AsyncTasks<ApiResponse> = Array<AsyncTask<ApiResponse>>;

const runWithConcurrency = (
  tasks : AsyncTasks<ApiResponse>,
  concurrencyLimit : number
) : Promise<Array<ApiResponse>> => {

  let results: Array<ApiResponse> = []
  let processingCount = 0
  let idx = 0

  while (idx < tasks.length) {
    if (processingCount < concurrencyLimit) {
      processingCount++
      const task = tasks[idx]
      task()
      .then(response => { 
        results.push(response)
        processingCount--
      })
      .catch(err => Promise.reject(err))
    }
  }

  return Promise.resolve(results)
}
