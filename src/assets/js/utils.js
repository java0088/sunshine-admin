  // 时间格式化
  export const getDate = (tm)=> {
    let date = new Date(tm);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let time = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    let hours = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours())
    let fen = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
    let miao = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
    let tt = year + '-' + month + '-' + time + ' ' + hours + ':' + fen + ":" + miao;
    return tt;
  }