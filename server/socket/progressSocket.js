export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_job', (jobId) => {
      socket.join(`job_${jobId}`);
      console.log(`Socket ${socket.id} joined job room: job_${jobId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export const emitProgress = (io, jobId, stage, percent) => {
  io.to(`job_${jobId}`).emit('generation:progress', {
    jobId,
    stage,
    percent
  });
};

export const emitCompletion = (io, jobId, songData) => {
  io.to(`job_${jobId}`).emit('generation:complete', {
    jobId,
    ...songData
  });
};

export const emitError = (io, jobId, message) => {
  io.to(`job_${jobId}`).emit('generation:error', {
    jobId,
    message
  });
};
