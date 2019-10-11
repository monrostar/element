import { createTest, destroyVM } from '../util';
import InputRange from 'packages/input-range';

describe('InputRange', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(InputRange, true);
    expect(vm.$el).to.exist;
  });
});

