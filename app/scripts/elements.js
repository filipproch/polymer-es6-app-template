(function () {
  'use strict'

  TemplateApp.Elements = window.TemplateApp.Elements || {}

  const flatten = (a) => a.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])

  let flattenBehaviors = (behaviors) => flatten(behaviors)

  TemplateApp.Behaviors = TemplateApp.Behaviors || {}
  TemplateApp.Behaviors.flatten = TemplateApp.Behaviors.flatten || flattenBehaviors

})()