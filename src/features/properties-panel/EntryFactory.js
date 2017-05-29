import domify from 'min-dom/lib/domify';
import domQuery from 'min-dom/lib/query';
import domEvent from 'min-dom/lib/event';
import domClasses from 'min-dom/lib/classes';

class EntryFactory {
  constructor() {
    this.handlers = {

      // select
      select(config) {
        const selectedOptionLabel = config.options.filter(option => {
          return option.value === config.selectedOption;
        })[0].label;

        const $entry = domify(`
          <div class="entry select">
            <div class="label">${config.label}</div>
            <div class="select-styled">${selectedOptionLabel}</div>
            <ul class="select-options"></ul>
          </div>
        `);

        const $selectStyled = domQuery('.select-styled', $entry);
        const $selectOptions = domQuery('.select-options', $entry);

        domEvent.bind($selectStyled, 'click', e => {
          if (domClasses($selectStyled).has('active')) {
            domClasses($selectStyled).remove('active');

            $selectOptions.style.display = 'none';
          } else {
            domClasses($selectStyled).add('active');

            $selectOptions.style.display = 'block';
          }
        });

        config.options.forEach(option => {
          if (option.value === config.selectedOption) {

            // skip selected option
            return;
          }

          const $option = domify(`<li class="select-option">${option.label}</li>`);

          domEvent.bind($option, 'click', () => {
            domClasses($selectStyled).remove('active');

            $selectOptions.style.display = 'none';

            $selectStyled.textContent = option.label;

            config.onChange(option.value);
          });

          $selectOptions.appendChild($option);
        });

        domEvent.bind(document, 'click', ({ target }) => {
          if (target !== $selectStyled &&
              domClasses($selectStyled).has('active') &&
              !domClasses(target).has('select-option')) {

            console.log('fooo');
            domClasses($selectStyled).remove('active');

            $selectOptions.style.display = 'none';
          }
        });

        return $entry;
      },

      // range
      range(config) {
        const $entry = domify(`
          <div class="entry range">
            <div class="label">${config.label}</div>
            <div class="input">
              <input class="range" type="range" min="${config.min}" max="${config.max}" step="${config.step}" value="${config.value}"/>
              <span class="value">${config.value}</span>
            </div>
          </div>
        `);

        const $range = domQuery('input', $entry);
        const $value = domQuery('.value', $entry);

        domEvent.bind($range, 'input', () => {
          config.onInput($range.value);
          $value.textContent = $range.value;
        });

        domEvent.bind($range, 'change', () => {
          config.onChange($range.value);
          $value.textContent = $range.value;

          $range.blur();
        });

        return $entry;
      },
    }
  }

  createEntry(config) {
    return this.handlers[config.type](config);
  }
}

export default EntryFactory;
