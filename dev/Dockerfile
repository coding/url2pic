# Base
FROM node:8.1.2
LABEL GC_BY_CODING_JOB=true

WORKDIR /app

COPY imageroot/ /
RUN apt update && \
  apt upgrade -y && \
  apt install -y libxss1 libappindicator1 libindicator7 && \
  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
  dpkg -i google-chrome*.deb ; \
  apt install -fy

RUN wget http://coding-dev.ufile.ucloud.com.cn/SourceHanSansCN.tar.xz
RUN tar -xJf SourceHanSansCN.tar.xz && mv SourceHanSansCN /usr/share/fonts && fc-cache -vf

COPY ./.src /app/

CMD npm run start
