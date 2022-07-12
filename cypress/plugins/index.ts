// RUN ON SERVER
export default (on: any, config: any) => {
  on('task', {
    'clear:db': () => {
      console.log('----------- db cleared with clear:db');
      return true;
    },
  });
  on('task', {
    'restart:db': (data: any) => {
      console.log('----------- db restart with restart:db', data);
      return true;
    },
  });
};
