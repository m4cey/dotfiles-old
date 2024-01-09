export PREFIX = .local/share/
export MANPREFIX = .local/share/man/
export DESTDIR = $(HOME)/
TOPTARGETS := all clean install uninstall

SUBDIRS := $(wildcard */.)

$(TOPTARGETS): $(SUBDIRS)
$(SUBDIRS):
	$(MAKE) -C $@ $(MAKECMDGOALS)

.PHONY: $(TOPTARGETS) $(SUBDIRS)
