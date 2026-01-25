# FullStackOpen2022_Part5 Testing React apps

## Practices
- completed
- optional: *can do the cypress E2E test one later*

## Exercises
- [x] exercise 5.1
- [x] exercise 5.2
- [x] exercise 5.3
- [x] exercise 5.4
- [ ] exercise 5.5
- [ ] exercise 5.6
- [ ] exercise 5.7
- [ ] exercise 5.8
- [ ] exercise 5.9
- [ ] exercise 5.10
- [ ] exercise 5.11
- [ ] exercise 5.12
- [ ] exercise 5.13
- [ ] exercise 5.14
- [ ] exercise 5.15
- [ ] exercise 5.16
- [ ] exercise 5.17
- [ ] exercise 5.18
- [ ] exercise 5.19
- [ ] exercise 5.20
- [ ] exercise 5.21
- [ ] exercise 5.22
- [ ] exercise 5.23

## Set-up
# .env
- REACT_APP_API_KEY=openweather app api key

## Issues
- trailing spaces in globals eslint.config.js github discussion: [github link to global dicussion](https://github.com/sindresorhus/globals/issues/239)

## Up to
- **Part 5d** - *Playwright*

## Notes
### Snapshot testing
- Vitest offers a completely different alternative to "traditional" testing called snapshot testing. The interesting feature of snapshot testing is that developers do not need to define any tests themselves, it is simple enough to adopt snapshot testing.

- The fundamental principle is to compare the HTML code defined by the component after it has changed to the HTML code that existed before it was changed.

- If the snapshot notices some change in the HTML defined by the component, then either it is new functionality or a "bug" caused by accident. Snapshot tests notify the developer if the HTML code of the component changes. The developer has to tell Vitest if the change was desired or undesired. If the change to the HTML code is unexpected, it strongly implies a bug, and the developer can become aware of these potential issues easily thanks to snapshot testing.

### playwright
- default port 9232 the report opens on doesn't work in wsl for some reaosn: will give forbidden 403 exception so switched to using 9090 for now (but for some reason it works now with 9232 not sure why)

- npx playwright codegen http://localhost:5173/ to generate code snippets for playwright tests, when record mode is on, can copy the locators and actions to the tests

- can use **--trace on** to enabled checking the locators of all the elements in the frontend in the report


