<template>
  <transition name="el-zoom-in-top">
    <div
      class="el-table-filter"
      v-show="showPopper">
      <div class="el-table-filter__content">
        <el-scrollbar wrap-class="el-table-filter__wrap">
          <template v-for="filter in filters">

            <section v-if="filter.type === types.checkboxGroup" class="el-table-filter__checkbox-group">
              <el-checkbox-group
                v-model="filteredValue[filter.name]"
              >
                <el-checkbox v-for="(filterItem, filterItemKey) in filter.data"
                  :key="`${filterItem.value}_${filterItemKey}`"
                  :label="filterItem.value">{{ filterItem.text }}
                </el-checkbox>
              </el-checkbox-group>
            </section>

            <section v-if="filter.type === types.input" class="el-table-filter__input">
              <el-form v-if="filter.data.label && filter.data.label !== ''" :label-position="filter.data.labelPosition || 'top'">
                <el-form-item :label="filter.data.label">
                  <el-input
                    v-model="filteredValue[filter.name]"
                    :placeholder="filter.data.placeholder || ''"
                    :size="filter.data.size"
                  ></el-input>
                </el-form-item>
              </el-form>
              <el-input v-else
                v-model="filteredValue[filter.name]"
                :placeholder="filter.data.placeholder || ''"
                :size="filter.data.size"
              ></el-input>
            </section>

            <section v-if="filter.type === types.inputRange" class="el-table-filter__input-range">
              <el-input-range
                v-model="filteredValue[filter.name]"
                :start-placeholder="filter.data.startPlaceholder && filter.data.startPlaceholder || ''"
                :end-placeholder="filter.data.endPlaceholder && filter.data.endPlaceholder || ''"
                :size="filter.data.size && filter.data.size"
              ></el-input-range>
            </section>

            <section  v-if="filter.type === types.dateRange" class="el-table-filter__date-range">
              <el-date-picker
                v-model="filteredValue[filter.name]"
                type="daterange"
                align="right"
                unlink-panels
                :range-separator="filter.data.rangeSeparator || 'To'"
                :start-placeholder=" filter.data.startPlaceholder || 'Start date'"
                :end-placeholder="filter.data.endPlaceholder || 'End date'"
                :picker-options="filter.data.pickerOptions || {}">
              </el-date-picker>
            </section>

            <section  v-if="filter.type === types.select" class="el-table-filter__select">
              <el-select v-model="filteredValue[filter.name]" :placeholder="filter.data.placeholder">
                <el-option
                  v-for="item in filter.data.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </section>

            <section  v-if="filter.type === types.sliderRange" class="el-table-filter__slider-range">
              <div class="block">
                <el-slider
                  v-model="filteredValue[filter.name]"
                  range
                  :step="filter.data.step || 1"
                  :max="filter.data.max || 1000"
                  :min="filter.data.min || 0"
                >
                </el-slider>
              </div>
            </section>

          </template>
        </el-scrollbar>
      </div>
      <div class="el-table-filter__bottom">
        <el-button @click="handleReset" size="small" type="success">{{ t('el.table.resetFilter') }}</el-button>
        <el-button @click="handleConfirm" size="small" type="danger">{{ t('el.table.confirmFilter') }}
        </el-button>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  import Popper from 'element-ui/src/utils/vue-popper';
  import { PopupManager } from 'element-ui/src/utils/popup';
  import Locale from 'element-ui/src/mixins/locale';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import Dropdown from './dropdown';
  import {filteredTypes} from 'element-ui/packages/table/src/config.js';
  import ElCheckbox from 'element-ui/packages/checkbox';
  import ElCheckboxGroup from 'element-ui/packages/checkbox-group';
  import ElScrollbar from 'element-ui/packages/scrollbar';

  export default {
    name: 'ElTableFilterPanel',

    mixins: [Popper, Locale],

    directives: {
      Clickoutside
    },

    components: {
      ElCheckbox,
      ElCheckboxGroup,
      ElScrollbar
    },

    props: {
      placement: {
        type: String,
        default: 'bottom-end'
      }
    },

    methods: {
      isActive(filter) {
        return filter.value === this.filterValue;
      },

      handleOutsideClick() {
        setTimeout(() => {
          this.showPopper = false;
        }, 16);
      },

      handleConfirm() {
        this.confirmFilter(this.filteredValue);
        this.handleOutsideClick();
      },

      setDefaultFilteredValue() {
        this.filteredValue = {};
      },

      handleReset() {
        this.setDefaultFilteredValue();
        this.confirmFilter(this.filteredValue);
        this.handleOutsideClick();
      },

      handleSelect(filterValue) {
        this.filterValue = filterValue;

        if ((typeof filterValue !== 'undefined') && (filterValue !== null)) {
          this.confirmFilter(this.filteredValue);
        } else {
          this.setDefaultFilteredValue();
        }

        this.handleOutsideClick();
      },

      confirmFilter(filteredValue) {
        this.table.store.commit('filterChange', {
          column: this.column,
          values: filteredValue
        });
        this.table.store.updateAllSelected();
      }
    },

    data() {
      return {
        table: null,
        cell: null,
        column: null,
        filteredValue: {}
      };
    },

    computed: {
      types() {
        return filteredTypes;
      },

      filters() {
        return this.column && this.column.filters;
      }
    },

    mounted() {
      this.popperElm = this.$el;
      this.referenceElm = this.cell;
      this.table.bodyWrapper.addEventListener('scroll', () => {
        this.updatePopper();
      });

      this.$watch('showPopper', (value) => {
        if (this.column) this.column.filterOpened = value;
        if (value) {
          Dropdown.open(this);
        } else {
          Dropdown.close(this);
        }
      });
    },
    watch: {
      showPopper(val) {
        if (val === true && parseInt(this.popperJS._popper.style.zIndex, 10) < PopupManager.zIndex) {
          this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
        }
      }
    }
  };
</script>
