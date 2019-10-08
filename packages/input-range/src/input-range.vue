<template>
  <div
    class="el-date-editor el-range-editor el-input__inner"
    :class="[
      focused ? 'is-active' : ''
    ]"
    ref="reference">
    <i class="el-input__icon el-range__icon el-icon-edit"></i>
    <input
      ref="minInputRange"
      @focus="handleFocus"
      @focusout="handleBlur"
      @blur="handleBlur"
      :disabled="inputDisabled"
      :readonly="readonly"
      :placeholder="startPlaceholder"
      @input="val => handleValueInput(val, 'min')"
      @change="val => handleValueChange(val, 'min')"
      class="el-range-input">
    <slot name="range-separator">
      <span class="el-range-separator">{{ rangeSeparator }}</span>
    </slot>
    <input
      ref="maxInputRange"
      @focus="handleFocus"
      @focusout="handleBlur"
      @blur="handleBlur"
      :disabled="inputDisabled"
      :readonly="readonly"
      :placeholder="endPlaceholder"
      @input="val => handleValueInput(val, 'max')"
      @change="val => handleValueChange(val, 'max')"
      class="el-range-input">
  </div>
</template>
<script>
  import emitter from 'element-ui/src/mixins/emitter';
  import Migrating from 'element-ui/src/mixins/migrating';
  import merge from 'element-ui/src/utils/merge';

  export default {
    name: 'ElInputRange',

    componentName: 'ElInputRange',

    mixins: [emitter, Migrating],

    inheritAttrs: false,

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    data() {
      return {
        textareaCalcStyle: {},
        hovering: false,
        focused: false,
        isComposing: false,
        pickerVisible: false
      };
    },

    props: {
      value: {
        type: Array,
        default: () => ['', '']
      },
      size: String,
      resize: String,
      form: String,
      startPlaceholder: {
        type: String,
        default: 'Start value'
      },
      rangeSeparator: {
        type: String,
        default: 'To'
      },
      endPlaceholder: {
        type: String,
        default: 'End value'
      },
      disabled: Boolean,
      readonly: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      autocomplete: {
        type: String,
        default: 'off'
      },
      /** @Deprecated in next major version */
      autoComplete: {
        type: String,
        validator(val) {
          process.env.NODE_ENV !== 'production' &&
            console.warn('[Element Warn][Input]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.');
          return true;
        }
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      suffixIcon: String,
      prefixIcon: String,
      label: String,
      clearable: {
        type: Boolean,
        default: false
      },
      showPassword: {
        type: Boolean,
        default: false
      },
      showWordLimit: {
        type: Boolean,
        default: false
      },
      tabindex: String
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      validateState() {
        return this.elFormItem ? this.elFormItem.validateState : '';
      },
      needStatusIcon() {
        return this.elForm ? this.elForm.statusIcon : false;
      },
      validateIcon() {
        return {
          validating: 'el-icon-loading',
          success: 'el-icon-circle-check',
          error: 'el-icon-circle-close'
        }[this.validateState];
      },
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize });
      },
      inputSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      inputDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      },
      showClear() {
        return this.clearable &&
          !this.inputDisabled &&
          !this.readonly &&
          this.nativeInputValue &&
          (this.focused || this.hovering);
      },
      isWordLimitVisible() {
        return this.showWordLimit &&
          this.$attrs.maxlength &&
          (this.type === 'text' || this.type === 'textarea') &&
          !this.inputDisabled &&
          !this.readonly &&
          !this.showPassword;
      },
      upperLimit() {
        return this.$attrs.maxlength;
      }
    },

    watch: {
      value(val) {
        this.$nextTick(this.setNativeInputValue);
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', val);
        }
      },
      nativeInputValue() {
        this.setNativeInputValue();
      },
      type() {
        this.$nextTick(() => {
          this.setNativeInputValue();
        });
      }
    },

    methods: {
      getInput(type) {
        return this.$refs[type === 'min' ? 'minInputRange' : 'maxInputRange'];
      },

      focus() {
        this.getInput().focus();
      },
      blur() {
        this.getInput().blur();
      },
      getMigratingConfig() {
        return {
          props: {
            'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
            'on-icon-click': 'on-icon-click is removed.'
          },
          events: {
            'click': 'click is removed.'
          }
        };
      },
      handleBlur(event) {
        this.focused = false;
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur', this.value);
        }
      },
      select() {
        this.getInput().select();
      },

      nativeInputValue(type) {
        if (this.value === null || this.value === undefined || !this.value.length) return '';
        if (type === 'min') {
          return this.value[0] || '';
        } else {
          return this.value[1] || '';
        }
      },

      setNativeInputValue() {
        const inputMin = this.getInput('min');
        if (inputMin && inputMin !== this.nativeInputValue('min')) {
          inputMin.value = this.nativeInputValue('min');
        }
        const inputMax = this.getInput('max');
        if (inputMax && inputMax !== this.nativeInputValue('max')) {
          inputMax.value = this.nativeInputValue('max');
        }
      },

      handleValueInput(el, type) {
        if (!el) return;
        if (type === 'min') {
          this.value[0] = el.target.value;
        } else {
          this.value[1] = el.target.value;
        }
        this.$emit('input', [this.nativeInputValue('min'), this.nativeInputValue('max')]);
        // ensure native input value is controlled
        // see: https://github.com/ElemeFE/element/issues/12850
        this.$nextTick(this.setNativeInputValue);
      },

      handleValueChange(el, type) {
        if (!el) return;
        if (type === 'min') {
          this.value[0] = el.target.value;
        } else {
          this.value[1] = el.target.value;
        }
        this.$emit('change', [this.nativeInputValue('min'), this.nativeInputValue('max')]);
      },
      handleFocus(event) {
        this.focused = true;
        this.$emit('focus', event);
      },
      clear() {
        this.$emit('input', '');
        this.$emit('change', '');
        this.$emit('clear');
      },
      getSuffixVisible() {
        return this.$slots.suffix ||
          this.suffixIcon ||
          this.showClear ||
          this.showPassword ||
          this.isWordLimitVisible ||
          (this.validateState && this.needStatusIcon);
      }
    },

    created() {
      this.$on('inputSelect', this.select);
    },

    mounted() {
      this.setNativeInputValue();
    }
  };
</script>
