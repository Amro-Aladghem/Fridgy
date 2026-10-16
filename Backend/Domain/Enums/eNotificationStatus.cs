using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Enums
{
    public enum eNotificationStatus
    {
        Queued=1,
        Running,
        WaitingForUser,
        Completed,
        Failed
    }
}
