<template>
  <div class="sign-up-container">
    <h1 class="sign-up__headline headline">Стать разработчиком</h1>
    <form @submit.prevent="validateBeforeSubmit" class="sign-up-form">
      <div class="sign-up-form__section">
          <div class="section__step-number">1</div>
          <input type="text" name="first-name" class="validate-field" placeholder="Имя"
                 v-model="newDeveloper.FirstName" data-vv-as="'Имя'"
                 v-validate="{ required: true, min: 1, max: 30, regex: /[а-яА-ЯёЁ-]+$/ }"
                 autofocus />
          <div class="help-message-input" v-show="errors.has('first-name')">
              {{ errors.first('first-name') }}
          </div>
          <input type="text" name="surname" class="validate-field" placeholder="Фамилия"
                 v-model="newDeveloper.LastName" data-vv-as="'Фамилия'"
                 v-validate="{ required: true, min: 1, max: 30, regex: /[а-яА-ЯёЁ-]+$/ }"
          />
          <div class="help-message-input" v-show="errors.has('surname')">
              {{ errors.first('surname') }}
          </div>
      </div>
      <div class="sign-up-form__section">
          <div class="section__step-number">2</div>
          <select @change="newDeveloper.InstituteName=$event.target.value"
            v-validate="{ required: true }" data-vv-as="'Институт'">
              <option value="" disabled="true" selected>Институт</option>
              <option value="ИТАСУ" :selected="newDeveloper.InstituteName=='ИТАСУ'">ИТАСУ</option>
              <option value="ЭкоТех" :selected="newDeveloper.InstituteName=='ЭкоТех'">ЭкоТех</option>
              <option value="ИНМиН" :selected="newDeveloper.InstituteName=='ИНМиН'">ИНМиН</option>
              <option value="ЭУПП" :selected="newDeveloper.InstituteName=='ЭУПП'">ЭУПП</option>
              <option value="ИБС" :selected="newDeveloper.InstituteName=='ИБС'">ИБС</option>
              <option value="ИБО" :selected="newDeveloper.InstituteName=='ИБО'">ИБО</option>
              <option value="Горный" :selected="newDeveloper.InstituteName=='Горный'">Горный</option>
          </select>
          <input type="text" name="department" class="validate-field" placeholder="Кафедра"
                 v-model="newDeveloper.Department" data-vv-as="'Кафедра'"
                 v-validate="{ required: true, min: 1, max: 255, regex: /[а-яА-ЯёЁ-]+$/ }"
          />
          <div class="help-message-input" v-show="errors.has('department')">
              {{ errors.first('department') }}
          </div>
          <input type="text" name="profile" class="validate-field" placeholder="Специальность"
                 v-model="newDeveloper.StudyingProfile" data-vv-as="'Специальность'"
                 v-validate="{ required: true, min: 1, max: 255, regex: /[а-яА-ЯёЁ-]+$/ }"
          />
          <div class="help-message-input" v-show="errors.has('profile')">
              {{ errors.first('profile') }}
          </div>
          <input type="number" name="year" class="validate-field" placeholder="Год поступления"
                 v-model="newDeveloper.AccessionYear" data-vv-as="'Год поступления'"
                 min="2000" :max="new Date().getFullYear()"
                 v-validate="{ required: true}"
          />
          <div class="help-message-input" v-show="errors.has('year')">
              {{ errors.first('year') }}
          </div>
          <div class="sign-up-form__switcher" style="padding-top: 0; padding-bottom: 0">
              <label class="sign-up-form__label"><input type="checkbox" class="sign-up__checkbox"
                 v-model="newDeveloper.IsGraduated"/><span>Я закончил(а) обучение</span></label>
          </div>
      </div>
      <div class="sign-up-form__section">
          <div class="section__step-number">3</div>
          <input type="url" name="vkUrl" class="validate-field" placeholder="Профиль Вконтакте"
                 v-model="newDeveloper.VkProfileUri" data-vv-as="'Профиль Вконтакте'"
                 v-validate="{ required: false, min: 1, max: 100, regex: /^(http|https)?:\/\/vk.com\/+$/ }"
          />
          <div class="help-message-input" v-show="errors.has('vkUrl')">
              Введите адрес в формате
              http(s)://vk.com/[username]
          </div>
          <input type="tel" name="phone" class="validate-field" placeholder="Номер телефона"
            v-model="newDeveloper.PhoneNumber" data-vv-as="'Номер телефона'"
            v-validate="{ required: true, min: 11, max: 12, regex: /^((\+7|7|8)+([0-9]){10})$/ }"/>
          <div class="help-message-input" v-show="errors.has('phone')">
              Введите номер без пробелов и разделителей
          </div>
      </div>
      <div class="sign-up-form__section">
          <div class="section__step-number">4</div>
          <div class="sign-up-form__switcher">
              <p>
                  После нажатия "Отправить заявку" вы будете перенаправлены на страницу авторизации GitHub.
              </p>
              <p>
                  В качестве E-mail будет использован указанный в GitHub профиле.
              </p>
              <div class="dividing-line"></div>
              <p class="sign-up-form__question">Хотите иметь возможность входа на сайт не только через GitHub?</p>
              <label class="sign-up-form__label"
                @click="isPasswordRequired = !isPasswordRequired">
                  <input type="checkbox" class="sign-up__checkbox"
                         style="width: 18px; margin-right: 4px"
                         v-model="isPasswordRequired" />
                  <span class="sign-up-form__question">Указать другой E-mail и установить пароль.</span>
              </label>
          </div>
      </div>
      <div class="sign-up-form__section" v-if="isPasswordRequired">
          <input type="email" name="email" class="validate-field" placeholder="E-mail"
                 v-validate="{ required: true }"
                 v-model="newDeveloper.Email" data-vv-as="'E-mail'"/>
          <div class="help-message-input" v-show="errors.has('email')">
              {{ errors.first('email') }}
          </div>
          <input type="password" name="password" class="validate-field" placeholder="Пароль"
                 v-model="newDeveloper.Password" data-vv-as="'Пароль'"
                 v-validate="{ required: true, min: 8, max: 50, regex: /^(?=^.{8,50}$)[a-zA-Z0-9]+$/ }"
          />
          <div class="help-message-input" v-show="errors.has('password')">
              {{ errors.first('password') }}
          </div>

          <div class="help-message-input" v-show="errors.has('password')">
              Пароль должен быть длинной не менее 8
              символов и содержать латинские буквы
              или цифры.
          </div>
          <input type="password" name="repeatedPassword" class="validate-field" placeholder="Повторите пароль"
                 v-validate="{ required: true, min: 8, max: 50, regex: /^(?=^.{8,50}$)[a-zA-Z0-9]+$/ }"
                 v-model="repeatedPassword" />

          <div class="help-message-input"
            v-show="newDeveloper.Password && !errors.has('password') && repeatedPassword !== newDeveloper.Password">
            Пароли не совпадают.
          </div>
      </div>
  </form>
    <button class="sign-up__button" v-if="newDeveloperStateStatus === 'available'"
      @click="signUp()">
      Отправить заявку
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isPasswordRequired: false,
      repeatedPassword: ""
    };
  },
  computed: {
    ...mapGetters(["newDeveloper", "newDeveloperStateStatus"])
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          return;
        }
      });
    },
    signUp() {
      this.$store.dispatch("POST_NEW_DEVELOPER", this.newDeveloper);
    }
  }
};
</script>
