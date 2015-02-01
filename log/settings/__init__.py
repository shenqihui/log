try:
    from settings import *

except ImportError, e:
    if e.args[0].startswith('No module named settings'):
        pass
    else:
        raise  # the ImportError is raised inside dev_settings
