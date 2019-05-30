/* eslint-env jasmine */
import { shallowMount } from '@vue/test-utils'
import pageIntroLevel from 'ozaria/site/components/play/PageIntroLevel/index'
import factories from 'test/app/factories'
import api from 'core/api'
import interactiveComponent from 'ozaria/site/components/interactive/PageInteractive'
import cinematicComponent from 'ozaria/site/components/cinematic/PageCinematic'

const createComponent = (values = {}) => {
  return shallowMount(pageIntroLevel, {
    propsData: values
  })
}

const introLevel = {
  _id: 'intro-level-id',
  slug: 'intro-level-slug',
  introContent: [
    {
      type: 'cinematic',
      contentSlug: 'cinematic-slug-1'
    },
    {
      type: 'interactive',
      contentSlug: 'interactive-slug-1'
    }
  ]
}

const introLevelSession = {
  state: {
    complete: false
  }
}

let pageIntroLevelWrapper

describe('Intro level Page', () => {
  beforeEach((done) => {
    spyOn(api.levels, 'getByIdOrSlug').and.returnValue(Promise.resolve(introLevel))
    spyOn(api.levels, 'upsertSession').and.returnValue(Promise.resolve(introLevelSession))

    me.set(factories.makeUser({ permissions: ['admin'] }).attributes)
    pageIntroLevelWrapper = createComponent({ introLevelIdOrSlug: introLevel.slug })
    _.defer(done)
  })

  it('renders a vue instance', () => {
    expect(pageIntroLevelWrapper.isVueInstance()).toBe(true)
  })

  it('renders the content in correct sequence', () => {
    expect(pageIntroLevelWrapper.contains(cinematicComponent)).toBe(true)
    expect(pageIntroLevelWrapper.contains(interactiveComponent)).toBe(false)
    pageIntroLevelWrapper.find(cinematicComponent).vm.$emit('completed')
    expect(pageIntroLevelWrapper.contains(cinematicComponent)).toBe(false)
    expect(pageIntroLevelWrapper.contains(interactiveComponent)).toBe(true)
  })

  it('sets complete:true in the intro level session when all content completed', () => {
    pageIntroLevelWrapper.find(cinematicComponent).vm.$emit('completed')
    pageIntroLevelWrapper.find(interactiveComponent).vm.$emit('completed')
  })
})
