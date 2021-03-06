from flask import Flask, request, send_file, jsonify, render_template
from selenium import webdriver
import pandas
from bs4 import BeautifulSoup
import requests
import io
import traceback
import time

GOOGLE_CHROME_PATH = '/app/.apt/usr/bin/google-chrome'
CHROMEDRIVER_PATH = '/app/.chromedriver/bin/chromedriver'
#CHROMEDRIVER_PATH = r'C:\Users\Vova\Documents\chromedriver\chromedriver.exe'


app = Flask(__name__)


def parse_to_pandas(building, floor, audience, date, base_url):
    # конструирую строку запроса на сервак
    if building is None:
        raise TypeError("building arg dont passed")
    if floor is None:
        raise TypeError("floor arg dont passed")
    if audience is None:
        raise TypeError("audience dont passed")
    if date is None:
        raise TypeError("date dont passed in format dd.mm.yyyy")
    new_url = base_url + "?building=" + building + "&floor=" + floor + "&audience=" + audience + "&date=" + date

    # делаю запрос на сервак
    page = requests.get(new_url)
    # пихаю ответ от сервера в аналог jsoup, но на python
    soup = BeautifulSoup(page.text, 'lxml')
    # нахожу таблицу с id = 'schedule'
    test = soup.find('table', id='schedule')
    #if test.text is None:
    #    raise Exception("table with id schedule is not found,\n check your args or try again")

    # для того чтобы взять день недели, 1 строка таблицы
    row_index = 0
    day = ''
    # массив результатов он будет типа [name, time, action_name, action_groups, action_type, action_teacher]
    # далее заполнится
    schedule = []
    # для всех строк внутри той таблицы
    for row in test.find_all('tr'):
        # Обработаем день недели
        if row_index == 0:
            day = row.find('td').text
            row_index = row_index + 1
            continue
        # возьмем все td (а у нас их 2, только 2 может быть пустой)
        td_array = row.find_all('td')
        # берем первую td, там где инфа о паре, состоящая из 2 div
        # 1 - название типа "1 пара"
        # 2 - время типа "8:00 - 9:35"
        time_info = td_array[0].find_all('div')
        name = time_info[0].text
        time = time_info[1].text
        # теперь возьмем инфу о занятии
        action_info = td_array[1]
        # проверим, что оно не пустое
        if action_info.text == '':
            action_name = ""
            action_groups = ""
            action_type = ""
            action_teacher = ""
            # если пустой, то добавляем пустые данные и идем дальше
            schedule.append([name, time, action_name, action_groups, action_type, action_teacher])
            continue
        # если же нет, то начнем с имени предмета, это просто, найти font с class='font-subject'
        action_name = action_info.find('font', attrs={'class': 'font-subject'}).text
        # теперь берем группы, вначале пусть он пустой
        action_groups = ""
        # элементы находятся в font с class='font-classroom' в ссылках
        tmp = action_info.find('font', attrs={'class': 'font-classroom'})
        links_array = tmp.find_all('a')
        # считая, что тут может быть несколько групп
        for link in links_array:
            # забираем текст изнутри ссылкы(не саму ссылку, а текст, внутри которого ссылка)
            action_groups += link.text
            action_groups += ','
        # удаляю последнюю запятую
        action_groups = action_groups[:-1]
        # теперь перейдем к типу нашего занятия, баг это или нет, но пока,
        # есть 3 элемента font с классом "font-teacher", 1 - пустой, 2 -тип занятия, 3 - препод
        # тогда берем все font с этим классом
        font_with_teacher_class_array = action_info.find_all('font', attrs={'class': 'font-teacher'})
        # тип занятия это второй элемент
        action_type = font_with_teacher_class_array[1].text
        # для учителя это второй элемент и ссылка внутри него
        tmp = font_with_teacher_class_array[2]
        action_teacher = tmp.find('a').text
        # пихаю результаты для сеюя просто в массив
        schedule.append([name, time, action_name, action_groups, action_type, action_teacher])

    df = pandas.DataFrame(schedule,
                          columns=['name', 'time', 'action_name', 'action_groups', 'action_type', 'action_teacher'])
    return df


@app.route('/')
def main_func():
    return render_template('index.html')


def simulate_pushing_buttons(p_building, p_floor, p_audience, p_date):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.binary_location = GOOGLE_CHROME_PATH
    chrome_options.add_argument('headless')
    browser = webdriver.Chrome(executable_path=CHROMEDRIVER_PATH, chrome_options=chrome_options)
    browser.get('https://lk.ugatu.su/audience')
    building = browser.find_element_by_id('id_building')
    building.send_keys(p_building)
    time.sleep(1)
    floor = browser.find_element_by_id('id_floor')
    floor.send_keys(p_floor)
    time.sleep(1)
    audit = browser.find_element_by_id('id_audience')
    audit.send_keys(p_audience)
    time.sleep(1)
    tmp = browser.find_element_by_xpath("//ul[@id='id_ScheduleType']/li[3]")
    tmp.click()
    time.sleep(1)
    date = browser.find_element_by_name('date')
    date.clear()
    date.send_keys(p_date)
    time.sleep(1)
    but = browser.find_element_by_name('view')
    but.click()
    result = browser.page_source
    browser.close()
    return result


@app.route('/schedule')
def hello_world():
    p_building = request.args.get('building')
    p_floor = request.args.get('floor')
    p_audience = request.args.get('audience')
    p_date = request.args.get('date')
    try:
        if p_building is None:
            raise TypeError("building arg dont passed")
        if p_floor is None:
            raise TypeError("floor arg dont passed")
        if p_audience is None:
            raise TypeError("audience dont passed")
        if p_date is None:
            raise TypeError("date dont passed in format dd.mm.yyyy")
        result = simulate_pushing_buttons(p_building, p_floor, p_audience, p_date)
        return result
    except TypeError as error:
        return str(traceback.format_exc())


@app.route('/parse_to_table')
def parse_to_table():
    base_url = r'https://kurstestspelevova.herokuapp.com/schedule'
    p_building = request.args.get('building')
    p_floor = request.args.get('floor')
    p_audience = request.args.get('audience')
    p_date = request.args.get('date')
    try:
        df = parse_to_pandas(p_building, p_floor, p_audience, p_date, base_url)
    except TypeError as error:
        return str(traceback.format_exc())
    except AttributeError as error:
        return str(traceback.format_exc())
    except Exception as error:
        return str(traceback.format_exc())
    return df.to_html()


@app.route('/parse_to_excel')
def parse_to_excel():
    base_url = r'https://kurstestspelevova.herokuapp.com/schedule'
    p_building = request.args.get('building')
    p_floor = request.args.get('floor')
    p_audience = request.args.get('audience')
    p_date = request.args.get('date')
    try:
        df = parse_to_pandas(p_building, p_floor, p_audience, p_date, base_url)
    except TypeError as error:
        return str(traceback.format_exc())
    except AttributeError as error:
        return str(traceback.format_exc())
    except Exception as error:
        return str(traceback.format_exc())
    strIO = io.BytesIO()
    excel_writer = pandas.ExcelWriter(strIO, engine="xlsxwriter")
    df.to_excel(excel_writer, sheet_name='sheet1')
    excel_writer.save()
    excel_data = strIO.getvalue()
    strIO.seek(0)
    return send_file(strIO, attachment_filename='test.xlsx', as_attachment=True)


@app.route('/parse_to_json')
def parse_to_json():
    base_url = r'https://kurstestspelevova.herokuapp.com/schedule'
    p_building = request.args.get('building')
    p_floor = request.args.get('floor')
    p_audience = request.args.get('audience')
    p_date = request.args.get('date')
    try:
        df = parse_to_pandas(p_building, p_floor, p_audience, p_date, base_url)
    except TypeError as error:
        return str(traceback.format_exc())
    except AttributeError as error:
        return str(traceback.format_exc())
    except Exception as error:
        return str(traceback.format_exc())
    result = {}
    for index, row in df.iterrows():
        result[index] = dict(row)
    return jsonify(result), 200, {'Content-Type': 'application-json'}


if __name__ == '__main__':
    app.run()
