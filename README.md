popapilus
=========

development in process...

Описание
--------

Popapilus это jQuery плагин для создания попапов: модальные окна, хинты и т.д.
Текущая версия: 0.8

Знакомство
----------

В отличие от большинства плгинов для создания модальных окон popapilus создает свое окно и получает контент в качестве параметра метода show.
Простейшее использование с параметрами по умолчанию:

    popapilus = $.popapilus();
    popapilus.show('<h1>Hello world!</h1>');

Параметры и методы
------------------

### Инициализация

`$.popapilus([options])`

Возвращаемое значение: `Popapilus` объект
Параметры:
**options** - хэш-объект, настройки отображения попапа. Включает в себя как настройки инициализации, которые потом не изменить для этого объекта, так и настроки, которые будут использоваться по умолчанию для настроек, задачаемых для параметра `show`.
